package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String techStack;

    private String clientName;

    private String liveUrl;

    private String imageUrl;

    private LocalDate completedDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
