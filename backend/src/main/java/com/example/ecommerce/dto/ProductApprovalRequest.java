package com.example.ecommerce.dto;

import com.example.ecommerce.model.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductApprovalRequest {
    @NotNull(message = "Status is required")
    private ProductStatus status; // APPROVED, REJECTED

    private LocalDateTime releaseDate;
}
