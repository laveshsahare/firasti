package com.veena.travel.controller;

import com.veena.travel.dto.AuthRequest;
import com.veena.travel.dto.AuthResponse;
import com.veena.travel.dto.RegisterRequest;
import com.veena.travel.dto.UserResponse;
import com.veena.travel.model.Role;
import com.veena.travel.model.User;
import com.veena.travel.repository.UserRepository;
import com.veena.travel.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthController(
      AuthenticationManager authenticationManager,
      UserDetailsService userDetailsService,
      JwtService jwtService,
      UserRepository userRepository,
      PasswordEncoder passwordEncoder
  ) {
    this.authenticationManager = authenticationManager;
    this.userDetailsService = userDetailsService;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody AuthRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );
    var user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));
    var token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
    return new AuthResponse(token, UserResponse.from(user));
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
    }

    var user = new User();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setRole(Role.USER);

    var savedUser = userRepository.save(user);
    var token = jwtService.generateToken(userDetailsService.loadUserByUsername(savedUser.getEmail()));
    return new AuthResponse(token, UserResponse.from(savedUser));
  }
}
