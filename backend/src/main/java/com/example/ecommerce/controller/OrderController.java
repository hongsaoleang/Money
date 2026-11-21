package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CreateOrderRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.TelegramLinkToken;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.TelegramBotService;
import com.example.ecommerce.service.TelegramLinkTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TelegramLinkTokenService linkTokenService;
    private final TelegramBotService botService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(orderService.placeOrder(request, userEmail));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(orderService.getUserOrders(userDetails.getUsername()));
    }

    /**
     * Generates or fetches a secure, single-use Telegram link token for this order
     */
    @GetMapping("/{id}/telegram-link")
    public ResponseEntity<Map<String, Object>> getTelegramOrderLink(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        Long userId = null;
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        }

        TelegramLinkToken linkToken = linkTokenService.createTokenForOrder(order.getId(), userId);
        String deepLink = linkTokenService.buildDeepLink(linkToken.getToken());

        return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "formattedOrderId", String.format("JH-%04d", order.getId()),
                "token", linkToken.getToken(),
                "telegramLinkUrl", deepLink,
                "botUsername", botService.getBotUsername(),
                "botDisplayName", "JomnenhKh"
        ));
    }
}
