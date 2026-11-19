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

    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegistrationOtp(@Valid @RequestBody com.example.ecommerce.dto.SendOtpRequest request) {
        authService.sendRegistrationOtp(request);
        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "A 6-digit verification code has been sent to " + request.getEmail()
        ));
    }

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

    @PutMapping("/avatar")
    public ResponseEntity<?> updateAvatar(
            @RequestBody java.util.Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails
    ) {
        String email = payload.get("email");
        if (userDetails != null && userDetails.getUsername() != null) {
            email = userDetails.getUsername();
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Email is required"));
        }
        return authService.updateAvatar(email.trim().toLowerCase(), payload.get("avatar"));
    }

    @PostMapping(value = "/avatar/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestPart("image") org.springframework.web.multipart.MultipartFile image,
            @RequestParam(value = "email", required = false) String emailParam,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails
    ) {
        String email = emailParam;
        if (userDetails != null && userDetails.getUsername() != null) {
            email = userDetails.getUsername();
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Email is required"));
        }
        return authService.uploadAvatar(email.trim().toLowerCase(), image);
    }
}
