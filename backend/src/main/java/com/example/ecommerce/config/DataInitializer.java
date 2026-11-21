package com.example.ecommerce.config;

import com.example.ecommerce.model.*;
import com.example.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final DeveloperProfileRepository developerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Always ensure the primary administrator account hongsaoleang@gmail.com is synchronized
        syncPrimaryAdminAccount();
        seedDeveloperProfiles();

        // Ensure default service offerings and portfolio projects exist if empty
        seedDefaultServicesAndPortfolio();
    }

    private void seedDefaultServicesAndPortfolio() {
        if (serviceOfferingRepository.count() == 0) {
            ServiceOffering s1 = ServiceOffering.builder()
                    .title("Custom Web Application Development")
                    .slug("custom-web-applications")
                    .summary("Full-stack, reactive, and scalable web platforms built with React, Next.js, Spring Boot, and cloud-native microservices.")
                    .description("We design and engineer bespoke web solutions engineered for maximum performance, SEO optimization, and enterprise scalability. From interactive SaaS dashboards to distributed marketplaces, we turn complex business logic into intuitive user experiences.")
                    .icon("Globe")
                    .active(true)
                    .build();

            ServiceOffering s2 = ServiceOffering.builder()
                    .title("Cross-Platform Mobile App Development")
                    .slug("mobile-app-development")
                    .summary("High-performance iOS and Android applications built with React Native and Flutter with native device integration.")
                    .description("Deliver seamless, 60fps mobile applications on both Apple App Store and Google Play. We implement offline-first data synchronization, biometric authentication, push notifications, and payment gateways tailored to your customer journey.")
                    .icon("Smartphone")
                    .active(true)
                    .build();

            serviceOfferingRepository.saveAll(List.of(s1, s2));
        }

        if (portfolioProjectRepository.count() == 0) {
            PortfolioProject port1 = PortfolioProject.builder()
                    .title("OmniCommerce Global Retail Engine")
                    .description("Architected and developed a multi-tenant cloud retail system supporting over 120,000 daily transactions with real-time inventory synchronization across 4 continents.")
                    .techStack("React, Spring Boot, PostgreSQL, Redis, AWS ECS")
                    .clientName("Nordic Retail Group")
                    .liveUrl("https://example.com/case-studies/omnicommerce")
                    .imageUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80")
                    .completedDate(LocalDate.now().minusMonths(4))
                    .build();

            PortfolioProject port2 = PortfolioProject.builder()
                    .title("SwiftCourier On-Demand Logistics App")
                    .description("End-to-end mobile and web dispatching solution featuring real-time driver GPS tracking, automated route optimization, and digital proof-of-delivery.")
                    .techStack("React Native, Spring Boot, PostgreSQL, WebSockets, Google Maps API")
                    .clientName("LogiFleet Express")
                    .liveUrl("https://example.com/case-studies/swiftcourier")
                    .imageUrl("https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80")
                    .completedDate(LocalDate.now().minusMonths(8))
                    .build();

            PortfolioProject port3 = PortfolioProject.builder()
                    .title("HealthPulse Telehealth & EHR Platform")
                    .description("HIPAA-compliant telehealth platform connecting patients with specialist physicians, featuring encrypted video calls and automated prescription issuance.")
                    .techStack("React, TypeScript, Spring Boot Security, WebRTC, PostgreSQL")
                    .clientName("Vanguard Health Systems")
                    .liveUrl("https://example.com/case-studies/healthpulse")
                    .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80")
                    .completedDate(LocalDate.now().minusMonths(12))
                    .build();

            portfolioProjectRepository.saveAll(List.of(port1, port2, port3));
        }
    }

    private void seedDeveloperProfiles() {
        if (developerProfileRepository.count() > 0) return;

        developerProfileRepository.saveAll(List.of(
                DeveloperProfile.builder()
                        .name("Hong Saoleang")
                        .role("Full-Stack Architect & System Designer")
                        .badgeRole("Founder & Full-Stack Architect")
                        .pill("Founder & Lead")
                        .avatar("/JomnenhKH.jpg")
                        .tier(0)
                        .lead(true)
                        .displayOrder(0)
                        .bio("Built the platform architecture, APIs, authentication, and data models.")
                        .skills("Spring Boot 3,React.js,PostgreSQL,REST APIs,JWT Security")
                        .build(),
                DeveloperProfile.builder()
                        .name("Alex Rivera")
                        .role("Frontend & UI Systems Lead")
                        .badgeRole("Frontend & UI Systems Lead")
                        .pill("Frontend Lead")
                        .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80")
                        .tier(1)
                        .displayOrder(1)
                        .bio("Built the responsive interface, navigation, and shopping experience.")
                        .skills("Vite,Responsive CSS,State Management,UI/UX")
                        .build(),
                DeveloperProfile.builder()
                        .name("Devon Vance")
                        .role("Database & Infrastructure Engineer")
                        .badgeRole("Database & Infrastructure Engineer")
                        .pill("Database & Cloud")
                        .avatar("https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80")
                        .tier(2)
                        .displayOrder(2)
                        .bio("Maintains the database, cloud infrastructure, and platform security.")
                        .skills("PostgreSQL,Docker,Mail Servers,DevOps")
                        .build()
        ));
    }

    private void syncPrimaryAdminAccount() {
        userRepository.findByEmail("hongsaoleang@gmail.com").ifPresentOrElse(
            existing -> {
                existing.setPassword(passwordEncoder.encode("leang30122006"));
                existing.setRole(Role.ROLE_ADMIN);
                existing.setActive(true);
                userRepository.save(existing);
            },
            () -> {
                // If legacy admin@ecommerce.com exists, migrate it to preserve product vendor references
                User legacyAdmin = userRepository.findByEmail("admin@ecommerce.com").orElse(null);
                if (legacyAdmin != null) {
                    legacyAdmin.setEmail("hongsaoleang@gmail.com");
                    legacyAdmin.setFullName("Hong Saoleang");
                    legacyAdmin.setPassword(passwordEncoder.encode("leang30122006"));
                    legacyAdmin.setRole(Role.ROLE_ADMIN);
                    legacyAdmin.setActive(true);
                    if (legacyAdmin.getPhone() == null || legacyAdmin.getPhone().startsWith("+1")) {
                        legacyAdmin.setPhone("+855 12 019 2834");
                    }
                    userRepository.save(legacyAdmin);
                } else {
                    User newAdmin = User.builder()
                            .email("hongsaoleang@gmail.com")
                            .password(passwordEncoder.encode("leang30122006"))
                            .fullName("Hong Saoleang")
                            .role(Role.ROLE_ADMIN)
                            .phone("+855 12 019 2834")
                            .address("100 Innovation Way, Suite 400, San Francisco, CA")
                            .active(true)
                            .build();
                    userRepository.save(newAdmin);
                }
            }
        );
    }
}
