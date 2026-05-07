package com.veena.travel.dto;

import java.math.BigDecimal;

public record PaymentPageResponse(
    Long bookingId,
    String gateway,
    String paymentLinkId,
    String paymentUrl,
    BigDecimal amount,
    Integer amountInPaise,
    String currency,
    String status
) {}
