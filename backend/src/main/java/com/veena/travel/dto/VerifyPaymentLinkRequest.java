package com.veena.travel.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyPaymentLinkRequest(
    @NotBlank String razorpayPaymentId,
    @NotBlank String razorpayPaymentLinkId,
    @NotBlank String razorpayPaymentLinkReferenceId,
    @NotBlank String razorpayPaymentLinkStatus,
    @NotBlank String razorpaySignature
) {}
