package com.example.ecommerce.service;

import com.example.ecommerce.dto.AuthResponse;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.security.CustomUserDetails;
import com.example.ecommerce.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final OtpService otpService;
    private final EmailService emailService;

    public void sendRegistrationOtp(com.example.ecommerce.dto.SendOtpRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("This email is already registered: " + cleanEmail);
        }

        String otp = otpService.generateAndSaveOtp(cleanEmail);
        emailService.sendRegistrationOtp(cleanEmail, request.getFullName(), otp);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email is already registered: " + cleanEmail);
        }

        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new IllegalArgumentException("Verification code (OTP) is required.");
        }

        boolean validOtp = otpService.verifyOtp(cleanEmail, request.getOtp().trim());
        if (!validOtp) {
            throw new IllegalArgumentException("Invalid or expired verification code. Please check your email and try again.");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.ROLE_USER;
        // Prevent registering directly as ADMIN via public register
        if (userRole == Role.ROLE_ADMIN) {
            userRole = Role.ROLE_USER;
        }

        User user = User.builder()
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(userRole)
                .active(true)
                .build();

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );

        String jwt = jwtUtils.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .avatar(userDetails.getAvatar())
                .phone(user.getPhone())
                .address(user.getAddress())
                .telegramChatId(user.getTelegramChatId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User dbUser = userRepository.findByEmail(cleanEmail).orElse(null);

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .avatar(userDetails.getAvatar())
                .phone(dbUser != null ? dbUser.getPhone() : null)
                .address(dbUser != null ? dbUser.getAddress() : null)
                .telegramChatId(dbUser != null ? dbUser.getTelegramChatId() : null)
                .build();
    }

    @Transactional
    public AuthResponse googleLogin(String email, String fullName) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail).orElseGet(() -> {
            Role role = cleanEmail.equalsIgnoreCase("hongsaoleang@gmail.com") ? Role.ROLE_ADMIN : Role.ROLE_USER;
            User newUser = User.builder()
                    .email(cleanEmail)
                    .fullName(fullName != null && !fullName.trim().isEmpty() ? fullName.trim() : cleanEmail.split("@")[0])
                    .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                    .role(role)
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        });

        if (cleanEmail.equalsIgnoreCase("hongsaoleang@gmail.com") && user.getRole() != Role.ROLE_ADMIN) {
            user.setRole(Role.ROLE_ADMIN);
            user = userRepository.save(user);
        }

        CustomUserDetails userDetails = CustomUserDetails.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .address(user.getAddress())
                .telegramChatId(user.getTelegramChatId())
                .build();
    }

    @Transactional
    public ResponseEntity<?> updateProfile(String email, java.util.Map<String, String> payload) {
        return userRepository.findByEmail(email).map(user -> {
            if (payload.containsKey("address")) {
                user.setAddress(payload.get("address"));
            }
            if (payload.containsKey("phone")) {
                user.setPhone(payload.get("phone"));
            }
            if (payload.containsKey("telegramChatId")) {
                user.setTelegramChatId(payload.get("telegramChatId"));
            }
            if (payload.containsKey("fullName") && payload.get("fullName") != null && !payload.get("fullName").isBlank()) {
                user.setFullName(payload.get("fullName").trim());
            }
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Map.of(
                    "success", true,
                    "address", user.getAddress() != null ? user.getAddress() : "",
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "telegramChatId", user.getTelegramChatId() != null ? user.getTelegramChatId() : ""
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    public ResponseEntity<?> updateAvatar(String email, String avatar) {
        return userRepository.findByEmail(email).map(user -> {
            user.setAvatar(avatar);
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Map.of("success", true, "avatar", avatar != null ? avatar : ""));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    public ResponseEntity<?> uploadAvatar(String email, org.springframework.web.multipart.MultipartFile image) {
        if (image == null || image.isEmpty() || image.getSize() > 5L * 1024 * 1024) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Choose an image smaller than 5 MB."));
        }
        String extension = switch (image.getContentType() == null ? "" : image.getContentType().toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
        String filename = "avatar-" + java.util.UUID.randomUUID() + extension;
        java.nio.file.Path destinationDir = java.nio.file.Paths.get("uploads", "developers").toAbsolutePath().normalize();
        try {
            java.nio.file.Files.createDirectories(destinationDir);
            image.transferTo(destinationDir.resolve(filename));
            String avatarUrl = "/api/developer-photos/" + filename;
            return userRepository.findByEmail(email).map(user -> {
                user.setAvatar(avatarUrl);
                userRepository.save(user);
                return ResponseEntity.ok(java.util.Map.of("success", true, "avatar", avatarUrl));
            }).orElse(ResponseEntity.notFound().build());
        } catch (java.io.IOException e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Could not save avatar file."));
        }
    }
}
