package com.example.ecommerce.service;

import com.example.ecommerce.dto.CreateOrderRequest;
import com.example.ecommerce.dto.OrderItemRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
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

    @Transactional
    public Order placeOrder(CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : user.getAddress())
                .orderStatus("CONFIRMED")
                // Estimated delivery date: 4 days after the order timestamp
                .estimatedDeliveryDate(LocalDateTime.now().plusDays(4))
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            items.add(orderItem);
        }

        order.setTotalAmount(total);
        order.setItems(items);

        return orderRepository.save(order);
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
