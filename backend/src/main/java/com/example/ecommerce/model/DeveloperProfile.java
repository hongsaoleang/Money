package com.example.ecommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "developer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeveloperProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String badgeRole;

    @Column(nullable = false)
    private String pill;

    @Column(nullable = false, length = 1000)
    private String avatar;

    @Column(nullable = false, length = 1000)
    private String bio;

    @Column(length = 1000)
    private String skills;

    @Builder.Default
    private int tier = 0;

    @Builder.Default
    private boolean lead = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private int displayOrder = 0;
}
