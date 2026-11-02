package com.example.ecommerce.config;

import com.example.ecommerce.model.*;
import com.example.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println(">>> Initializing E-Commerce & Agency Platform Seed Data...");

        // 1. Users
        User admin = User.builder()
                .email("admin@ecommerce.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .role(Role.ROLE_ADMIN)
                .phone("+1 555-0100")
                .address("100 Innovation Way, Suite 400, San Francisco, CA")
                .active(true)
                .build();

        User client = User.builder()
                .email("client@ecommerce.com")
                .password(passwordEncoder.encode("client123"))
                .fullName("Apex Tech Partner LLC")
                .role(Role.ROLE_CLIENT)
                .phone("+1 555-0200")
                .address("250 Tech Hub Boulevard, Austin, TX")
                .active(true)
                .build();

        User user = User.builder()
                .email("user@ecommerce.com")
                .password(passwordEncoder.encode("user123"))
                .fullName("Alex Morgan")
                .role(Role.ROLE_USER)
                .phone("+1 555-0300")
                .address("742 Evergreen Terrace, Springfield, OR")
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, client, user));

        // 2. Categories
        Category catElectronics = Category.builder()
                .name("Smart Devices")
                .slug("smart-devices")
                .description("Next-generation smart hardware and flagship personal devices.")
                .build();

        Category catAudio = Category.builder()
                .name("Audio & Acoustics")
                .slug("audio-acoustics")
                .description("High-fidelity audio monitors and noise-cancelling headphones.")
                .build();

        Category catWorkstations = Category.builder()
                .name("Developer Workstations")
                .slug("developer-workstations")
                .description("Ergonomic accessories, mechanical keyboards, and precision peripherals.")
                .build();

        categoryRepository.saveAll(List.of(catElectronics, catAudio, catWorkstations));

        // 3. Products
        Product p1 = Product.builder()
                .name("NovaPro Ultrabook M3")
                .slug("novapro-ultrabook-m3")
                .description("Engineered for developers and creators. Featuring an OLED 120Hz display, 64GB unified memory, and 18-hour battery longevity.")
                .price(new BigDecimal("1899.99"))
                .stockQuantity(25)
                .originCountry("Germany")
                .provenanceDetails("Precision machined in Stuttgart, Germany. Chassis forged from 100% recycled aerospace-grade aluminum with zero-carbon assembly.")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80")
                .status(ProductStatus.APPROVED)
                .releaseDate(LocalDateTime.now().minusDays(10)) // already released
                .category(catWorkstations)
                .vendor(admin)
                .build();

        Product p2 = Product.builder()
                .name("AeroSpatial Studio Headphones")
                .slug("aerospatial-studio-headphones")
                .description("Audiophile planar-magnetic wireless headphones with spatial sound stage and lossless 24-bit audio streaming.")
                .price(new BigDecimal("349.50"))
                .stockQuantity(40)
                .originCountry("Japan")
                .provenanceDetails("Hand-assembled in Kyoto, Japan. Diaphragms tuned by sound engineers with organic lambskin acoustic cushions.")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80")
                .status(ProductStatus.APPROVED)
                .releaseDate(LocalDateTime.now().minusDays(5)) // already released
                .category(catAudio)
                .vendor(admin)
                .build();

        Product p3 = Product.builder()
                .name("Quantum Mech Keyboard Pro")
                .slug("quantum-mech-keyboard-pro")
                .description("Gasket-mounted hot-swappable mechanical keyboard with custom factory-lubed switches and seamless Bluetooth 5.4.")
                .price(new BigDecimal("219.00"))
                .stockQuantity(15)
                .originCountry("Taiwan")
                .provenanceDetails("CNC anodized brass weight plate manufactured in Hsinchu Science Park, Taiwan. Inspected individually for key travel consistency.")
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80")
                .status(ProductStatus.APPROVED)
                .releaseDate(LocalDateTime.now().minusDays(2)) // already released
                .category(catWorkstations)
                .vendor(admin)
                .build();

        // Upcoming Product (Scheduled release date 7 days in future!)
        Product pUpcoming = Product.builder()
                .name("CyberGrip Smart Ring Titanium")
                .slug("cybergrip-smart-ring-titanium")
                .description("Next-gen biometric health tracking, haptic gesture controls, and NFC payment in a featherlight grade-5 titanium form factor.")
                .price(new BigDecimal("299.00"))
                .stockQuantity(50)
                .originCountry("Switzerland")
                .provenanceDetails("Micro-sensors crafted in Neuchâtel, Switzerland. Medical-grade titanium micro-forging with hypoallergenic inner ceramic coating.")
                .imageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80")
                .status(ProductStatus.APPROVED)
                .releaseDate(LocalDateTime.now().plusDays(7)) // UPCOMING!
                .category(catElectronics)
                .vendor(admin)
                .build();

        // Client submitted product (PENDING REVIEW)
        Product pClientPending = Product.builder()
                .name("Apex Wireless Ergonomic Vertical Mouse")
                .slug("apex-wireless-vertical-mouse")
                .description("Ergonomic vertical posture mouse reducing wrist strain by 70%, 4000 DPI sensor, and silent tactile clicks.")
                .price(new BigDecimal("89.99"))
                .stockQuantity(100)
                .originCountry("South Korea")
                .provenanceDetails("Developed and designed in Seoul, South Korea with bio-friendly polymers.")
                .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80")
                .status(ProductStatus.PENDING_REVIEW) // Waiting for admin review!
                .category(catWorkstations)
                .vendor(client)
                .build();

        productRepository.saveAll(List.of(p1, p2, p3, pUpcoming, pClientPending));

        // 4. Software Services Offerings
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

        ServiceOffering s3 = ServiceOffering.builder()
                .title("Enterprise Cloud & Backend Systems")
                .slug("cloud-backend-systems")
                .summary("Robust Spring Boot & PostgreSQL architecture with Docker, Kubernetes, CI/CD pipelines, and high-availability caching.")
                .description("Reliable backend architectures supporting high-throughput transactions, database replication, and zero-downtime rolling updates. We ensure banking-grade security and automated compliance.")
                .icon("Server")
                .active(true)
                .build();

        serviceOfferingRepository.saveAll(List.of(s1, s2, s3));

        // 5. Portfolio of Completed Projects
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

        System.out.println(">>> Seed Data initialized successfully!");
    }
}
