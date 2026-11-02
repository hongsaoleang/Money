package com.example.ecommerce.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDto {
    private long totalUsers;
    private long totalProducts;
    private long pendingProductApprovals;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long activeServices;
    private long totalPortfolioProjects;
    private long totalInquiries;
}
