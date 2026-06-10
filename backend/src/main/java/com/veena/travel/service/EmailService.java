package com.veena.travel.service;

import com.veena.travel.model.Booking;
import com.veena.travel.model.User;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
  private static final String BRAND_NAME = "Firasti";
  private static final String BRAND_TAGLINE = "Your Travel Companion";

  private final JavaMailSender mailSender;
  private final String fromAddress;

  public EmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
    this.mailSender = mailSender;
    this.fromAddress = fromAddress;
  }

  public boolean sendRegistrationEmail(User user) {
    var message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(user.getEmail());
    message.setSubject("Welcome to " + BRAND_NAME + " - " + BRAND_TAGLINE);
    message.setText("""
        Hello %s,

        Welcome to %s! 🎉

        Your account has been created successfully. You can now:

        ✈️  Search and book flights at great prices
        🏨  Find perfect hotels for your stay
        🚌  Book buses for your road journeys
        🗺️  Use our city guide for travel suggestions
        💳  Secure payments through Cashfree

        Start exploring at %s and make your travel dreams come true!

        Happy travelling,
        Team %s
        %s

        ---
        Need help? Reply to this email or visit our support page.
        """.formatted(
            user.getName(),
            BRAND_NAME,
            BRAND_NAME,
            BRAND_NAME,
            BRAND_TAGLINE
        ));

    return send(message, "registration", user.getEmail());
  }

  public boolean sendTicketEmail(Booking booking) {
    var recipient = booking.getEmail() == null || booking.getEmail().isBlank()
        ? booking.getUser().getEmail()
        : booking.getEmail();

    if (recipient == null || recipient.isBlank()) {
      LOGGER.warn("Unable to send ticket email for booking {}: recipient email is missing.", booking.getId());
      return false;
    }

    var message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(recipient);
    message.setSubject(BRAND_NAME + " Ticket Confirmation - Booking #" + booking.getId());
    message.setText(buildTicketBody(booking));

    return send(message, "ticket", recipient);
  }

  private String buildTicketBody(Booking booking) {
    return """
        ═══════════════════════════════════════
              %s TRAVEL TICKET
              %s
        ═══════════════════════════════════════

        🎫 BOOKING CONFIRMATION

        Booking ID         : %s
        Status             : %s
        Product Type       : %s
        
        ───────────────────────────────────────
        👤 PASSENGER / GUEST DETAILS
        ───────────────────────────────────────
        Name               : %s
        Email              : %s
        
        ───────────────────────────────────────
        📍 BOOKING DETAILS
        ───────────────────────────────────────
        Title              : %s
        Route / Location   : %s
        Travel Date        : %s
        Check-in Date      : %s
        Check-out Date     : %s
        Departure Date     : %s
        Return Date        : %s
        
        ───────────────────────────────────────
        👥 GUESTS / PASSENGERS
        ───────────────────────────────────────
        Guests             : %s
        Passengers         : %s
        
        ───────────────────────────────────────
        💰 PAYMENT
        ───────────────────────────────────────
        Total Amount       : %s
        
        ═══════════════════════════════════════
        
        📌 IMPORTANT INFORMATION:
        
        • Please keep this email as your booking ticket
        • Show this ticket at the time of check-in/boarding
        • Carry a valid government ID proof
        • Arrive at least 30 minutes before departure
        
        ───────────────────────────────────────
        
        Thank you for choosing %s!
        We wish you a pleasant journey. ✈️🚌🏨
        
        Best Regards,
        Team %s
        %s
        
        ═══════════════════════════════════════
        
        Need help? Reply to this email.
        Visit us again at %s for more bookings!
        """.formatted(
        BRAND_NAME,
        BRAND_TAGLINE,
        value(booking.getId()),
        value(booking.getStatus()),
        value(booking.getProductType()),
        value(booking.getGuestName()),
        value(booking.getEmail()),
        value(booking.getTitle()),
        value(booking.getRoute()),
        value(booking.getTravelDate()),
        value(booking.getCheckIn()),
        value(booking.getCheckOut()),
        value(booking.getDepartureDate()),
        value(booking.getReturnDate()),
        value(booking.getGuests()),
        value(booking.getPassengers()),
        amount(booking.getPrice()),
        BRAND_NAME,
        BRAND_NAME,
        BRAND_TAGLINE,
        BRAND_NAME
    );
  }

  private boolean send(SimpleMailMessage message, String emailType, String recipient) {
    try {
      mailSender.send(message);
      LOGGER.info("[{}] Sent {} email to {}.", BRAND_NAME, emailType, recipient);
      return true;
    } catch (MailException exception) {
      LOGGER.warn("[{}] Unable to send {} email to {}: {}", BRAND_NAME, emailType, recipient, exception.getMessage());
      return false;
    }
  }

  private String value(Object value) {
    return value == null ? "-" : value.toString();
  }

  private String amount(BigDecimal value) {
    return value == null ? "-" : "₹ " + value;
  }
}