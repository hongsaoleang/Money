package com.example.ecommerce.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final Duration OTP_EXPIRY = Duration.ofMinutes(10);
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(30);
    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    @Getter
    @AllArgsConstructor
    private static class OtpEntry {
        private final String code;
        private final Instant expiresAt;
        private final Instant createdAt;
        private int attempts;

        public void incrementAttempts() {
            this.attempts++;
        }
    }

    /**
     * Generates a 6-digit numeric OTP for the given email, enforcing cooldown and 10m expiry.
     */
    public String generateAndSaveOtp(String email) {
        String cleanEmail = normalizeEmail(email);

        OtpEntry existing = otpStorage.get(cleanEmail);
        if (existing != null && Instant.now().isBefore(existing.getExpiresAt())) {
            long secondsSinceCreated = Duration.between(existing.getCreatedAt(), Instant.now()).getSeconds();
            if (secondsSinceCreated < RESEND_COOLDOWN.getSeconds()) {
                long waitTime = RESEND_COOLDOWN.getSeconds() - secondsSinceCreated;
                throw new IllegalArgumentException("Please wait " + waitTime + " seconds before requesting a new code.");
            }
        }

        // Generate 6-digit number between 100000 and 999999
        int num = 100000 + secureRandom.nextInt(900000);
        String code = String.valueOf(num);

        Instant now = Instant.now();
        Instant expiresAt = now.plus(OTP_EXPIRY);
        otpStorage.put(cleanEmail, new OtpEntry(code, expiresAt, now, 0));

        log.info("[OTP Service] Generated 6-digit OTP for email: {} (expires in 10 mins)", cleanEmail);
        return code;
    }

    /**
     * Verifies the user-entered OTP. Returns true if valid, false if incorrect or expired.
     */
    public boolean verifyOtp(String email, String userCode) {
        if (userCode == null || userCode.trim().isEmpty()) {
            return false;
        }

        String cleanEmail = normalizeEmail(email);
        OtpEntry entry = otpStorage.get(cleanEmail);

        if (entry == null) {
            log.warn("[OTP Service] Verification failed: No active OTP found for {}", cleanEmail);
            return false;
        }

        if (Instant.now().isAfter(entry.getExpiresAt())) {
            otpStorage.remove(cleanEmail);
            log.warn("[OTP Service] Verification failed: OTP expired for {}", cleanEmail);
            return false;
        }

        entry.incrementAttempts();
        if (entry.getAttempts() > MAX_ATTEMPTS) {
            otpStorage.remove(cleanEmail);
            log.warn("[OTP Service] Max attempts exceeded for {}", cleanEmail);
            throw new IllegalArgumentException("Too many incorrect verification attempts. Please request a new code.");
        }

        boolean matches = entry.getCode().equals(userCode.trim());
        if (matches) {
            otpStorage.remove(cleanEmail);
            log.info("[OTP Service] Successfully verified OTP for {}", cleanEmail);
            return true;
        } else {
            log.warn("[OTP Service] Incorrect OTP attempt ({}/{}) for {}", entry.getAttempts(), MAX_ATTEMPTS, cleanEmail);
            return false;
        }
    }

    public void clearOtp(String email) {
        if (email != null) {
            otpStorage.remove(normalizeEmail(email));
        }
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        return email.trim().toLowerCase();
    }
}
