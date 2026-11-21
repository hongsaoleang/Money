package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.TelegramCustomer;
import com.example.ecommerce.model.TelegramLinkToken;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.TelegramCustomerRepository;
import com.example.ecommerce.repository.TelegramLinkTokenRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramLinkTokenService {

    private final TelegramLinkTokenRepository tokenRepository;
    private final TelegramCustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${telegram.bot.username:EcommerceMoneyBot}")
    private String botUsername;

    @Transactional
    public TelegramLinkToken createTokenForOrder(Long orderId, Long userId) {
        // Look for existing valid unused token
        Optional<TelegramLinkToken> existing = tokenRepository
                .findFirstByOrderIdAndUsedFalseOrderByCreatedAtDesc(orderId);

        if (existing.isPresent() && existing.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            return existing.get();
        }

        String rawToken = "tok_" + UUID.randomUUID().toString().replace("-", "");
        TelegramLinkToken linkToken = TelegramLinkToken.builder()
                .token(rawToken)
                .orderId(orderId)
                .userId(userId)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        return tokenRepository.save(linkToken);
    }

    public String buildDeepLink(String token) {
        return "https://t.me/" + botUsername + "?start=" + token;
    }

    public String getBotBaseUrl() {
        return "https://t.me/" + botUsername;
    }

    @Transactional
    public Order validateAndLinkToken(String tokenStr, String chatId, String telegramUsername, String displayName) {
        if (tokenStr == null || tokenStr.isBlank()) {
            return null;
        }

        Optional<TelegramLinkToken> optToken = tokenRepository.findByToken(tokenStr.trim());
        if (optToken.isEmpty()) {
            log.warn("Telegram link token not found: {}", tokenStr);
            return null;
        }

        TelegramLinkToken token = optToken.get();
        if (token.isUsed()) {
            log.info("Telegram link token already used: {}, linked to {}", tokenStr, token.getLinkedChatId());
            return orderRepository.findById(token.getOrderId()).orElse(null);
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Telegram link token expired: {}", tokenStr);
            return null;
        }

        // Fetch target order
        Order order = orderRepository.findById(token.getOrderId()).orElse(null);
        if (order == null) {
            log.warn("Order not found for link token: {}", token.getOrderId());
            return null;
        }

        // 1. Associate order with Telegram chat ID
        order.setTelegramChatId(chatId);
        orderRepository.save(order);

        // 2. Associate authenticated User if applicable
        if (order.getUser() != null) {
            User user = order.getUser();
            if (user.getTelegramChatId() == null || user.getTelegramChatId().isBlank()) {
                user.setTelegramChatId(chatId);
                userRepository.save(user);
            }
        }

        // 3. Register or update TelegramCustomer record
        TelegramCustomer customer = customerRepository.findByTelegramChatId(chatId)
                .orElseGet(() -> TelegramCustomer.builder()
                        .telegramChatId(chatId)
                        .customerName(displayName != null && !displayName.isBlank() ? displayName : order.getCustomerName())
                        .telegramUsername(telegramUsername)
                        .phoneNumber(order.getPhoneNumber())
                        .userId(order.getUser() != null ? order.getUser().getId() : token.getUserId())
                        .conversationState("IDLE")
                        .active(true)
                        .build());

        if (telegramUsername != null && !telegramUsername.isBlank()) {
            customer.setTelegramUsername(telegramUsername);
        }
        if (order.getPhoneNumber() != null && !order.getPhoneNumber().isBlank()) {
            customer.setPhoneNumber(order.getPhoneNumber());
        }
        if (customer.getUserId() == null && order.getUser() != null) {
            customer.setUserId(order.getUser().getId());
        }
        customer.setLastActiveAt(LocalDateTime.now());
        customerRepository.save(customer);

        // 4. Mark token as consumed
        token.setUsed(true);
        token.setUsedAt(LocalDateTime.now());
        token.setLinkedChatId(chatId);
        tokenRepository.save(token);

        log.info("Successfully linked Telegram chat {} to Order #{} and Customer record", chatId, order.getId());
        return order;
    }
}
