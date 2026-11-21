package com.example.ecommerce.repository;

import com.example.ecommerce.model.TelegramCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TelegramCustomerRepository extends JpaRepository<TelegramCustomer, Long> {
    Optional<TelegramCustomer> findByTelegramChatId(String telegramChatId);
    Optional<TelegramCustomer> findByUserId(Long userId);
}
