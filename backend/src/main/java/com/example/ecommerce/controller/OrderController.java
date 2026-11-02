package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CreateOrderRequest;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(orderService.placeOrder(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(orderService.getUserOrders(userDetails.getUsername()));
    }
}
