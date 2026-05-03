package com.veena.travel.dto;

import com.veena.travel.model.ProductType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record BookingRequest(
    ProductType productType,
    Long hotelId,
    Long flightId,
    Long busId,
    String title,
    String route,
    String travelDate,
    BigDecimal price,
    @NotBlank String guestName,
    @Email String email,
    String checkIn,
    String checkOut,
    String departureDate,
    String returnDate,
    Integer guests,
    Integer passengers
) {}
