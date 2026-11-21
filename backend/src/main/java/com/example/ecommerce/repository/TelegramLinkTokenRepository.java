package com.example.ecommerce.repository;

import com.example.ecommerce.model.TelegramLinkToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelegramLinkTokenRepository extends JpaRepository<TelegramLinkToken, Long> {
    Optional<TelegramLinkToken> findByToken(String token);
    List<TelegramLinkToken> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    Optional<TelegramLinkToken> findFirstByOrderIdAndUsedFalseOrderByCreatedAtDesc(Long orderId);
}
