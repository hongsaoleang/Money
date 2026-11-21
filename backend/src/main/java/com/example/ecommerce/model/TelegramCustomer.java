package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "telegram_customers", indexes = {
    @Index(name = "idx_tc_chat_id", columnList = "telegramChatId", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelegramCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String telegramChatId;

    private Long userId;

    private String customerName;

    private String telegramUsername;

    private String phoneNumber;

    @Builder.Default
    private String conversationState = "IDLE"; // IDLE, AWAITING_SUPPORT_MESSAGE

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime linkedAt;

    @UpdateTimestamp
    private LocalDateTime lastActiveAt;
}
