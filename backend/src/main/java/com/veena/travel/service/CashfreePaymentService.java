package com.veena.travel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.veena.travel.dto.PaymentOrderResponse;
import com.veena.travel.dto.PaymentStatusResponse;
import com.veena.travel.dto.VerifyPaymentRequest;
import com.veena.travel.model.Booking;
import com.veena.travel.model.BookingStatus;
import com.veena.travel.repository.BookingRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.Instant;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CashfreePaymentService {
  private static final String PAYMENT_PENDING = "PENDING";
  private static final String PAYMENT_SUCCESS = "SUCCESS";
  private static final String PAYMENT_FAILED = "FAILED";
  private static final String GATEWAY_CASHFREE_CHECKOUT = "CASHFREE_CHECKOUT";
  private static final String BRAND_NAME = "Firasti";

  private final BookingRepository bookingRepository;
  private final EmailService emailService;
  private final RestClient restClient;
  private final ObjectMapper objectMapper;
  private final String clientId;
  private final String clientSecret;
  private final String apiVersion;
  private final String mode;
  private final String frontendBaseUrl;

  public CashfreePaymentService(
      BookingRepository bookingRepository,
      EmailService emailService,
      RestClient.Builder restClientBuilder,
      ObjectMapper objectMapper,
      @Value("${app.cashfree.client-id:}") String clientId,
      @Value("${app.cashfree.client-secret:}") String clientSecret,
      @Value("${app.cashfree.api-version:2023-08-01}") String apiVersion,
      @Value("${app.cashfree.mode:sandbox}") String mode,
      @Value("${app.frontend.base-url:http://localhost:4200}") String frontendBaseUrl
  ) {
    this.bookingRepository = bookingRepository;
    this.emailService = emailService;
    this.objectMapper = objectMapper;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.apiVersion = apiVersion;
    this.mode = "production".equalsIgnoreCase(mode) ? "production" : "sandbox";
    this.frontendBaseUrl = frontendBaseUrl.replaceAll("/+$", "");
    this.restClient = restClientBuilder.baseUrl(cashfreeBaseUrl(this.mode)).build();
  }

  public PaymentOrderResponse createOrder(Long bookingId, Principal principal) {
    var booking = findUserBooking(bookingId, principal);
    var amount = payableAmount(booking).setScale(2, RoundingMode.HALF_UP);
    requireGatewayConfig();

    var orderId = createCashfreeOrderId(booking.getId());
    var customerName = defaultString(booking.getGuestName(), booking.getUser().getName());
    var customerEmail = defaultString(booking.getEmail(), booking.getUser().getEmail());
    var customerPhone = "9999999999";

    if (customerName == null || customerName.isBlank()) {
      customerName = "Firasti Customer";
    }
    if (customerEmail == null || customerEmail.isBlank()) {
      customerEmail = "customer@firasti.com";
    }

    System.out.println("[" + BRAND_NAME + "] Creating payment - Name: " + customerName + ", Email: " + customerEmail + ", Phone: " + customerPhone + ", Amount: " + amount);

    var body = Map.ofEntries(
        Map.entry("order_id", orderId),
        Map.entry("order_amount", amount),
        Map.entry("order_currency", "INR"),
        Map.entry("customer_details", Map.of(
            "customer_id", "customer_" + booking.getUser().getId(),
            "customer_name", customerName,
            "customer_email", customerEmail,
            "customer_phone", customerPhone
        )),
        Map.entry("order_meta", Map.of(
            "return_url", frontendBaseUrl + "/booking/payment/" + booking.getId() + "?cashfree_order_id={order_id}",
            "notify_url", frontendBaseUrl + "/booking/payment/" + booking.getId()
        )),
        Map.entry("order_note", BRAND_NAME + " Travel Booking #" + booking.getId()),
        Map.entry("order_tags", Map.of(
            "booking_id", booking.getId().toString(),
            "brand", BRAND_NAME,
            "type", "travel_booking"
        ))
    );

    JsonNode response;
    try {
      response = restClient.post()
          .uri("/orders")
          .headers(this::addCashfreeHeaders)
          .body(body)
          .retrieve()
          .body(JsonNode.class);
    } catch (RestClientResponseException exception) {
      throw gatewayException(exception);
    }

    var paymentSessionId = response == null ? "" : response.path("payment_session_id").asText();
    if (paymentSessionId.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Cashfree did not return a payment session id.");
    }

    booking.setPaymentGateway(GATEWAY_CASHFREE_CHECKOUT);
    booking.setPaymentOrderId(orderId);
    booking.setPaymentStatus(PAYMENT_PENDING);
    booking.setStatus(BookingStatus.PENDING);
    bookingRepository.save(booking);

    return new PaymentOrderResponse(
        booking.getId(),
        GATEWAY_CASHFREE_CHECKOUT,
        orderId,
        paymentSessionId,
        mode,
        amount,
        amount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).intValueExact(),
        "INR",
        PAYMENT_PENDING,
        BRAND_NAME,
        BRAND_NAME + " Travel Booking #" + booking.getId(),
        customerName,
        customerEmail
    );
  }

  public PaymentStatusResponse verifyCheckoutPayment(Long bookingId, VerifyPaymentRequest request, Principal principal) {
    var booking = findUserBooking(bookingId, principal);

    if (booking.getPaymentOrderId() == null || booking.getPaymentOrderId().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Create a " + BRAND_NAME + " payment order before verifying payment.");
    }

    if (!booking.getPaymentOrderId().equals(request.cashfreeOrderId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment order does not match this booking.");
    }

    return resolveOrderStatus(booking);
  }

  public PaymentStatusResponse checkStatus(Long bookingId, Principal principal) {
    var booking = findUserBooking(bookingId, principal);

    if (PAYMENT_SUCCESS.equals(booking.getPaymentStatus())) {
      return paymentSuccessResponse(booking);
    }

    if (booking.getPaymentOrderId() == null || booking.getPaymentOrderId().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Create a " + BRAND_NAME + " payment order before checking payment status.");
    }

    return resolveOrderStatus(booking);
  }

  private PaymentStatusResponse resolveOrderStatus(Booking booking) {
    requireGatewayConfig();

    JsonNode response;
    try {
      response = restClient.get()
          .uri("/orders/{orderId}", booking.getPaymentOrderId())
          .headers(this::addCashfreeHeaders)
          .retrieve()
          .body(JsonNode.class);
    } catch (RestClientResponseException exception) {
      throw gatewayException(exception);
    }

    var cashfreeStatus = response == null ? "" : response.path("order_status").asText();
    var cfOrderId = response == null ? "" : response.path("cf_order_id").asText();
    var paymentId = cfOrderId.isBlank() ? booking.getPaymentOrderId() : cfOrderId;

    System.out.println("[" + BRAND_NAME + "] Payment Status Check - Booking #" + booking.getId() + " - Status: " + cashfreeStatus);

    if ("PAID".equalsIgnoreCase(cashfreeStatus)) {
      booking.setPaymentGateway(GATEWAY_CASHFREE_CHECKOUT);
      booking.setPaymentStatus(PAYMENT_SUCCESS);
      booking.setStatus(BookingStatus.CONFIRMED);
      booking.setPaymentId(paymentId);
      var savedBooking = bookingRepository.save(booking);
      return paymentSuccessResponse(savedBooking);
    }

    if ("EXPIRED".equalsIgnoreCase(cashfreeStatus) || "TERMINATED".equalsIgnoreCase(cashfreeStatus)) {
      booking.setPaymentStatus(PAYMENT_FAILED);
      booking.setStatus(BookingStatus.CANCELLED);
      booking.setPaymentId(paymentId);
      bookingRepository.save(booking);
      return new PaymentStatusResponse(
          booking.getId(),
          PAYMENT_FAILED,
          booking.getPaymentId(),
          "Payment was not completed. Please create a new " + BRAND_NAME + " payment and try again."
      );
    }

    if ("ACTIVE".equalsIgnoreCase(cashfreeStatus)) {
      return new PaymentStatusResponse(
          booking.getId(),
          PAYMENT_PENDING,
          paymentId,
          "Payment is in progress. Please complete the " + BRAND_NAME + " checkout and try Check Status again."
      );
    }

    return new PaymentStatusResponse(
        booking.getId(),
        PAYMENT_PENDING,
        paymentId,
        "Payment status: " + cashfreeStatus + ". Complete the " + BRAND_NAME + " checkout and check again."
    );
  }

  private PaymentStatusResponse paymentSuccessResponse(Booking booking) {
    var emailSent = emailService.sendTicketEmail(booking);
    var message = emailSent
        ? "Payment successful! Your " + BRAND_NAME + " booking ticket has been emailed."
        : "Payment successful! Your " + BRAND_NAME + " booking is confirmed. Email could not be sent - check backend mail settings.";
    return new PaymentStatusResponse(booking.getId(), PAYMENT_SUCCESS, booking.getPaymentId(), message);
  }

  private Booking findUserBooking(Long bookingId, Principal principal) {
    var booking = bookingRepository.findByIdWithUser(bookingId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));

    if (!booking.getUser().getEmail().equals(principal.getName())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this booking payment.");
    }

    return booking;
  }

  private BigDecimal payableAmount(Booking booking) {
    var unitPrice = booking.getPrice() == null ? BigDecimal.ZERO : booking.getPrice();
    var count = booking.getPassengers() != null ? booking.getPassengers() : booking.getGuests();
    return unitPrice.multiply(BigDecimal.valueOf(Math.max(1, count == null ? 1 : count)));
  }

  private void requireGatewayConfig() {
    if (clientId.isBlank() || clientSecret.isBlank()) {
      throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, BRAND_NAME + " payment gateway is not configured.");
    }
  }

  private void addCashfreeHeaders(org.springframework.http.HttpHeaders headers) {
    headers.set("x-client-id", clientId);
    headers.set("x-client-secret", clientSecret);
    headers.set("x-api-version", apiVersion);
  }

  private String createCashfreeOrderId(Long bookingId) {
    return "firasti_booking_" + bookingId + "_" + Instant.now().toEpochMilli();
  }

  private String defaultString(String value, String fallback) {
    if (value == null || value.isBlank()) {
      return fallback == null ? "" : fallback;
    }
    return value;
  }

  private String cashfreeBaseUrl(String mode) {
    return "production".equalsIgnoreCase(mode) ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
  }

  private ResponseStatusException gatewayException(RestClientResponseException exception) {
    var message = BRAND_NAME + " payment gateway request failed.";

    try {
      var body = objectMapper.readTree(exception.getResponseBodyAsString());
      var cashfreeMessage = body.path("message").asText();
      if (!cashfreeMessage.isBlank()) {
        message = cashfreeMessage;
      }
    } catch (Exception ignored) {
      if (!exception.getResponseBodyAsString().isBlank()) {
        message = exception.getResponseBodyAsString();
      }
    }

    System.err.println("[" + BRAND_NAME + "] Cashfree Error: " + message);
    return new ResponseStatusException(HttpStatus.BAD_GATEWAY, message);
  }
}