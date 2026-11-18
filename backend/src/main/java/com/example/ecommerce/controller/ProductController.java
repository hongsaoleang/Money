package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ProductRequest;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    // Public Sales & Profit Analytics
    @GetMapping("/products/analytics")
    public ResponseEntity<Map<String, Object>> getSalesAnalytics() {
        List<Order> orders = orderRepository.findAllWithItems();
        List<Product> products = productService.getPublicProducts();

        BigDecimal totalMoney = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Standard 38% net margin on hardware systems
        BigDecimal totalProfit = totalMoney.multiply(new BigDecimal("0.38"));

        Map<Long, Integer> productUnitsSold = new HashMap<>();
        Map<Long, BigDecimal> productRevenue = new HashMap<>();

        for (Order o : orders) {
            if (o.getItems() != null) {
                for (OrderItem item : o.getItems()) {
                    Long pId = item.getProduct().getId();
                    int qty = item.getQuantity() != null ? item.getQuantity() : 0;
                    productUnitsSold.put(pId, productUnitsSold.getOrDefault(pId, 0) + qty);
                    BigDecimal line = item.getUnitPrice().multiply(BigDecimal.valueOf(qty));
                    productRevenue.put(pId, productRevenue.getOrDefault(pId, BigDecimal.ZERO).add(line));
                }
            }
        }

        List<Map<String, Object>> productStats = new ArrayList<>();
        int totalUnits = 0;
        for (Product p : products) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("id", p.getId());
            stat.put("name", p.getName());
            stat.put("price", p.getPrice());
            stat.put("stockQuantity", p.getStockQuantity());
            int unitsSold = productUnitsSold.getOrDefault(p.getId(), 0);
            totalUnits += unitsSold;
            BigDecimal rev = productRevenue.getOrDefault(p.getId(), BigDecimal.ZERO);
            BigDecimal profit = rev.multiply(new BigDecimal("0.38"));
            stat.put("unitsSold", unitsSold);
            stat.put("revenue", rev);
            stat.put("profit", profit);
            productStats.add(stat);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalMoney", totalMoney);
        response.put("totalProfit", totalProfit);
        response.put("totalUnitsSold", totalUnits);
        response.put("totalOrders", orders.size());
        response.put("products", productStats);

        return ResponseEntity.ok(response);
    }

    // Public Categories
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // Public Active Products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(productService.searchProducts(search.trim()));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
        }
        return ResponseEntity.ok(productService.getPublicProducts());
    }

    // Public Upcoming / Scheduled Products (with release dates in the future)
    @GetMapping("/products/upcoming")
    public ResponseEntity<List<Product>> getUpcomingProducts() {
        return ResponseEntity.ok(productService.getUpcomingProducts());
    }

    // Public Product Detail
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Client/Vendor Submits a product to be deployed on website
    @PostMapping("/client/products")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<Product> submitClientProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(productService.createClientProduct(request, userDetails.getUsername()));
    }

    // Client/Vendor gets their own submitted products
    @GetMapping("/client/products")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<List<Product>> getClientProducts(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(productService.getVendorProducts(userDetails.getUsername()));
    }
}
