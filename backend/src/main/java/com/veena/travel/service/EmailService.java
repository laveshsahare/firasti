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
    message.setSubject("Welcome to Romify");
    message.setText("""
        Hello %s,

        Welcome to Romify.

        Your account has been created successfully. You can now search hotels, flights, buses, book your travel, and use the Romify city guide chatbot for place suggestions.

        Happy travelling,
        Team Romify
        """.formatted(user.getName()));

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
    message.setSubject("Romify Ticket - Booking #" + booking.getId());
    message.setText(buildTicketBody(booking));

    return send(message, "ticket", recipient);
  }

  private String buildTicketBody(Booking booking) {
    return """
        ROMIFY TRAVEL TICKET

        Booking ID: %s
        Status: %s
        Product Type: %s
        Passenger / Guest Name: %s
        Email: %s
        Title: %s
        Route / Location: %s
        Travel Date: %s
        Check-in: %s
        Check-out: %s
        Departure Date: %s
        Return Date: %s
        Guests: %s
        Passengers: %s
        Amount: %s

        Please keep this email as your booking ticket.

        Thank you for booking with Romify.
        """.formatted(
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
        amount(booking.getPrice())
    );
  }

  private boolean send(SimpleMailMessage message, String emailType, String recipient) {
    try {
      mailSender.send(message);
      LOGGER.info("Sent {} email to {}.", emailType, recipient);
      return true;
    } catch (MailException exception) {
      LOGGER.warn("Unable to send {} email to {}: {}", emailType, recipient, exception.getMessage());
      return false;
    }
  }

  private String value(Object value) {
    return value == null ? "-" : value.toString();
  }

  private String amount(BigDecimal value) {
    return value == null ? "-" : "INR " + value;
  }
}
