package com.veena.travel.controller;

import com.veena.travel.dto.PaymentOrderResponse;
import com.veena.travel.dto.PaymentPageResponse;
import com.veena.travel.dto.PaymentQrResponse;
import com.veena.travel.dto.PaymentStatusResponse;
import com.veena.travel.dto.VerifyPaymentLinkRequest;
import com.veena.travel.dto.VerifyPaymentRequest;
import com.veena.travel.service.RazorpayQrPaymentService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  private final RazorpayQrPaymentService paymentService;

  public PaymentController(RazorpayQrPaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping("/bookings/{bookingId}/page")
  public PaymentPageResponse createPaymentPage(@PathVariable Long bookingId, Principal principal) {
    return paymentService.createPaymentPage(bookingId, principal);
  }

  @PostMapping("/bookings/{bookingId}/page/verify")
  public PaymentStatusResponse verifyPaymentPage(
      @PathVariable Long bookingId,
      @Valid @RequestBody VerifyPaymentLinkRequest request,
      Principal principal
  ) {
    return paymentService.verifyPaymentPage(bookingId, request, principal);
  }

  @PostMapping("/bookings/{bookingId}/order")
  public PaymentOrderResponse createPaymentOrder(@PathVariable Long bookingId, Principal principal) {
    return paymentService.createOrder(bookingId, principal);
  }

  @PostMapping("/bookings/{bookingId}/verify")
  public PaymentStatusResponse verifyPayment(
      @PathVariable Long bookingId,
      @Valid @RequestBody VerifyPaymentRequest request,
      Principal principal
  ) {
    return paymentService.verifyCheckoutPayment(bookingId, request, principal);
  }

  @PostMapping("/bookings/{bookingId}/qr")
  public PaymentQrResponse createPaymentQr(@PathVariable Long bookingId, Principal principal) {
    return paymentService.createQr(bookingId, principal);
  }

  @GetMapping("/bookings/{bookingId}/status")
  public PaymentStatusResponse getPaymentStatus(@PathVariable Long bookingId, Principal principal) {
    return paymentService.checkStatus(bookingId, principal);
  }

}
