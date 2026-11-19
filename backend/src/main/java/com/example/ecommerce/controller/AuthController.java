package com.example.ecommerce.controller;

import com.example.ecommerce.dto.AuthResponse;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (org.springframework.security.authentication.BadCredentialsException |
                 org.springframework.security.core.userdetails.UsernameNotFoundException ex) {
            java.util.Map<String, Object> error = new java.util.LinkedHashMap<>();
            error.put("timestamp", java.time.Instant.now().toString());
            error.put("status", org.springframework.http.HttpStatus.UNAUTHORIZED.value());
            error.put("error", "Unauthorized");
            error.put("message", "Incorrect email or password. Please try again.");
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        String fullName = payload.get("fullName");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.googleLogin(email, fullName));
    }
}
