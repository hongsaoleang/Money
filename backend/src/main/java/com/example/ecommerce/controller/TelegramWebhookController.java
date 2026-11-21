package com.example.ecommerce.controller;

import com.example.ecommerce.service.TelegramBotService;
import com.example.ecommerce.service.TelegramUpdateHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/telegram")
@RequiredArgsConstructor
@Slf4j
public class TelegramWebhookController {

    private final TelegramUpdateHandler updateHandler;
    private final TelegramBotService botService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${telegram.bot.secret-token:jomnenhkh_telegram_secret_2026}")
    private String secretToken;

    /**
     * Webhook endpoint for receiving Telegram updates in production
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> receiveWebhook(
            @RequestHeader(value = "X-Telegram-Bot-Api-Secret-Token", required = false) String requestSecret,
            @RequestBody String rawUpdateJson
    ) {
        // Verify secret header if configured
        if (secretToken != null && !secretToken.isBlank() && requestSecret != null && !requestSecret.isBlank()) {
            if (!secretToken.equals(requestSecret)) {
                log.warn("Telegram webhook received with invalid secret token header");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid secret token");
            }
        }

        try {
            JsonNode updateNode = objectMapper.readTree(rawUpdateJson);
            updateHandler.processUpdate(updateNode);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            log.error("Error handling incoming Telegram webhook", e);
            return ResponseEntity.ok("ERROR_PARSING"); // Always 200 OK so Telegram doesn't aggressively retry
        }
    }

    /**
     * Returns public bot identity information for client applications
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getBotInfo() {
        return ResponseEntity.ok(Map.of(
                "botDisplayName", "JomnenhKh",
                "botUsername", botService.getBotUsername(),
                "deepLinkBase", "https://t.me/" + botService.getBotUsername(),
                "enabled", botService.isEnabled()
        ));
    }
}
