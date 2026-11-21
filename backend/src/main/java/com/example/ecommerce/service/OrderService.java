package com.example.ecommerce.service;

import com.example.ecommerce.dto.CreateOrderRequest;
import com.example.ecommerce.dto.OrderItemRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TelegramBotService telegramBotService;

    @Transactional
    public Order placeOrder(CreateOrderRequest request, String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalArgumentException("Authentication required: order cannot be placed without a registered user account.");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Registered user account not found: " + userEmail));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        String telegramChatId = request.getTelegramChatId();
        if ((telegramChatId == null || telegramChatId.isBlank()) && user != null) {
            telegramChatId = user.getTelegramChatId();
        }

        if (request.getTelegramChatId() != null && !request.getTelegramChatId().isBlank() && user != null) {
            user.setTelegramChatId(request.getTelegramChatId().trim());
            userRepository.save(user);
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress() != null && !request.getShippingAddress().isBlank()
                        ? request.getShippingAddress()
                        : (user != null && user.getAddress() != null ? user.getAddress() : "Phnom Penh, Cambodia"))
                .telegramChatId(telegramChatId)
                .orderStatus("CONFIRMED")
                // Estimated delivery date: 4 days after the order timestamp
                .estimatedDeliveryDate(LocalDateTime.now().plusDays(4))
                .totalAmount(BigDecimal.ZERO)
                .build();

        if (request.getItems() != null) {
            for (OrderItemRequest itemReq : request.getItems()) {
                if (itemReq.getProductId() == null) continue;
                Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
                if (product == null) continue;

                int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;

                // Safely deduct stock without failing
                int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                product.setStockQuantity(Math.max(0, currentStock - qty));
                productRepository.save(product);

                BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(qty));
                total = total.add(lineTotal);

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(qty)
                        .unitPrice(product.getPrice())
                        .build();

                items.add(orderItem);
            }
        }

        order.setTotalAmount(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (Exception ignored) {}

        try {
            telegramBotService.sendOrderNotification(savedOrder);
        } catch (Exception ignored) {}

        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setOrderStatus(status);
        return orderRepository.save(order);
    }
}
