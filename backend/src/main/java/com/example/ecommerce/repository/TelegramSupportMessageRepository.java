package com.example.ecommerce.repository;

import com.example.ecommerce.model.TelegramSupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelegramSupportMessageRepository extends JpaRepository<TelegramSupportMessage, Long> {
    List<TelegramSupportMessage> findByTelegramChatIdOrderByCreatedAtDesc(String telegramChatId);
    List<TelegramSupportMessage> findByStatusOrderByCreatedAtDesc(String status);
}
