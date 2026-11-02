package com.example.ecommerce.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    private String shippingAddress;
}
