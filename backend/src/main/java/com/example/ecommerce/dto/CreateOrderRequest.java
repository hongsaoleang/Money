package com.example.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private List<OrderItemRequest> items;
    private String shippingAddress;
    private String telegramChatId;
    private String customerName;
    private String customerContact;
    private String phoneNumber;
}
