package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductApprovalRequest;
import com.example.ecommerce.dto.ProductRequest;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.ProductStatus;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Public active products (approved and released)
    public List<Product> getPublicProducts() {
        return productRepository.findActivePublicProducts(ProductStatus.APPROVED, LocalDateTime.now());
    }

    // Public upcoming products (approved and release date in the future)
    public List<Product> getUpcomingProducts() {
        return productRepository.findUpcomingScheduledProducts(ProductStatus.APPROVED, LocalDateTime.now());
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryAndPublic(categoryId, ProductStatus.APPROVED, LocalDateTime.now());
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchPublicProducts(query, ProductStatus.APPROVED, LocalDateTime.now());
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with slug: " + slug));
    }

    // Client/Vendor creates product -> goes into PENDING_REVIEW status
    @Transactional
    public Product createClientProduct(ProductRequest request, String userEmail) {
        User vendor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .originCountry(request.getOriginCountry())
                .provenanceDetails(request.getProvenanceDetails())
                .imageUrl(request.getImageUrl())
                .status(ProductStatus.PENDING_REVIEW)
                .category(category)
                .vendor(vendor)
                .build();

        return productRepository.save(product);
    }

    // Admin creates product -> directly APPROVED and can set release date
    @Transactional
    public Product createAdminProduct(ProductRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + adminEmail));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .originCountry(request.getOriginCountry())
                .provenanceDetails(request.getProvenanceDetails())
                .imageUrl(request.getImageUrl())
                .status(ProductStatus.APPROVED)
                .releaseDate(request.getReleaseDate())
                .category(category)
                .vendor(admin)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setOriginCountry(request.getOriginCountry());
        product.setProvenanceDetails(request.getProvenanceDetails());
        product.setImageUrl(request.getImageUrl());
        product.setReleaseDate(request.getReleaseDate());

        return productRepository.save(product);
    }

    @Transactional
    public Product reviewClientProduct(Long id, ProductApprovalRequest request) {
        Product product = getProductById(id);
        product.setStatus(request.getStatus());
        if (request.getReleaseDate() != null) {
            product.setReleaseDate(request.getReleaseDate());
        }
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public List<Product> getPendingProductsForAdmin() {
        return productRepository.findByStatus(ProductStatus.PENDING_REVIEW);
    }

    public List<Product> getVendorProducts(String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + vendorEmail));
        return productRepository.findByVendorId(vendor.getId());
    }

    private String generateSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        return base + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
