package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String serviceType; // e.g. "Web Development", "Mobile App"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Builder.Default
    private String status = "NEW"; // NEW, IN_PROGRESS, RESOLVED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
