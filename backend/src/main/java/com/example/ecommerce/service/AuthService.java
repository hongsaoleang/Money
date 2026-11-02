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

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.ROLE_USER;
        // Prevent registering directly as ADMIN via public register
        if (userRole == Role.ROLE_ADMIN) {
            userRole = Role.ROLE_USER;
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
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
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .build();
    }
}
