package com.example.ecommerce.controller;

import com.example.ecommerce.dto.DashboardStatsDto;
import com.example.ecommerce.dto.ProductApprovalRequest;
import com.example.ecommerce.dto.ProductRequest;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.*;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final ContactInquiryRepository contactInquiryRepository;

    // Admin Dashboard Stats
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .pendingProductApprovals(productService.getPendingProductsForAdmin().size())
                .totalOrders(orders.size())
                .totalRevenue(totalRevenue)
                .activeServices(serviceOfferingRepository.findByActiveTrue().size())
                .totalPortfolioProjects(portfolioProjectRepository.count())
                .totalInquiries(contactInquiryRepository.count())
                .build();

        return ResponseEntity.ok(stats);
    }

    // Products - Full List for Admin
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    // Products - Pending Client Submissions
    @GetMapping("/products/pending")
    public ResponseEntity<List<Product>> getPendingClientProducts() {
        return ResponseEntity.ok(productService.getPendingProductsForAdmin());
    }

    // Admin Creates Product directly (with optional release date)
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(productService.createAdminProduct(request, userDetails.getUsername()));
    }

    // Admin Updates Product (CRUD & release date scheduling)
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // Admin Reviews / Approves / Rejects Client Product
    @PatchMapping("/products/{id}/review")
    public ResponseEntity<Product> reviewProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductApprovalRequest request
    ) {
        return ResponseEntity.ok(productService.reviewClientProduct(id, request));
    }

    // Admin Deletes Product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Categories CRUD
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Users list
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Orders list
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    // Update order status
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
