package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByStatus(ProductStatus status);
    List<Product> findByVendorId(Long vendorId);

    // Public products: approved AND (releaseDate is null OR releaseDate <= now)
    @Query("SELECT p FROM Product p WHERE p.status = :status AND (p.releaseDate IS NULL OR p.releaseDate <= :now)")
    List<Product> findActivePublicProducts(@Param("status") ProductStatus status, @Param("now") LocalDateTime now);

    // Upcoming products (with scheduled release date in future)
    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.releaseDate > :now ORDER BY p.releaseDate ASC")
    List<Product> findUpcomingScheduledProducts(@Param("status") ProductStatus status, @Param("now") LocalDateTime now);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.category.id = :categoryId AND (p.releaseDate IS NULL OR p.releaseDate <= :now)")
    List<Product> findByCategoryAndPublic(@Param("categoryId") Long categoryId, @Param("status") ProductStatus status, @Param("now") LocalDateTime now);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) AND (p.releaseDate IS NULL OR p.releaseDate <= :now)")
    List<Product> searchPublicProducts(@Param("query") String query, @Param("status") ProductStatus status, @Param("now") LocalDateTime now);
}
