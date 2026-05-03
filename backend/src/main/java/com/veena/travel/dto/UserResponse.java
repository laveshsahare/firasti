package com.veena.travel.dto;

import com.veena.travel.model.Role;
import com.veena.travel.model.User;

public record UserResponse(
    Long id,
    String name,
    String email,
    Role role
) {
  public static UserResponse from(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
  }
}
