package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ProductRequest;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

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
