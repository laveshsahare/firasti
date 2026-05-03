package com.veena.travel.dto;

public record AuthResponse(
    String token,
    UserResponse user
) {}
