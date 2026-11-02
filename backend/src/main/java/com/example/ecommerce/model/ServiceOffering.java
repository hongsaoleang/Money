package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_offerings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String icon;

    @Builder.Default
    private boolean active = true;
}
