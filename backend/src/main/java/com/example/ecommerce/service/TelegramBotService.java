package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@Slf4j
public class TelegramBotService {

    @Value("${telegram.bot.token:9174688661:AAG5lxoAuv1CgapUdqR6c59jsnj1mfKTTNM}")
    private String botToken;

    @Value("${telegram.bot.chat-id:1263944701}")
    private String chatId;

    @Value("${telegram.bot.enabled:true}")
    private boolean enabled;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public void sendOrderNotification(Order order) {
        if (!enabled || botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            log.info("Telegram notification skipped: disabled or missing credentials");
            return;
        }

        try {
            StringBuilder sb = new StringBuilder();
            sb.append("🛍 <b>NEW ORDER CONFIRMED & PAID!</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("🆔 <b>Order ID:</b> #").append(order.getId()).append("\n");
            if (order.getUser() != null) {
                sb.append("👤 <b>Customer:</b> ")
                  .append(escapeHtml(order.getUser().getFullName()))
                  .append(" (").append(escapeHtml(order.getUser().getEmail())).append(")\n");
            }
            if (order.getShippingAddress() != null && !order.getShippingAddress().isBlank()) {
                sb.append("📍 <b>Destination:</b> ")
                  .append(escapeHtml(order.getShippingAddress())).append("\n");
            }

            sb.append("\n📦 <b>ORDERED PRODUCTS:</b>\n");
            boolean hasSoldOut = false;
            int totalQty = 0;

            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                totalQty += qty;
                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));

                sb.append(" • <b>").append(escapeHtml(product.getName())).append("</b>\n");
                sb.append("   - <b>Qty:</b> ").append(qty).append(" unit(s)\n");
                sb.append("   - <b>Price:</b> $").append(unitPrice).append(" (Subtotal: $").append(lineTotal).append(")\n");

                int remainingStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                if (remainingStock <= 0) {
                    sb.append("   🚨 <b>INVENTORY: SOLD OUT (0 in stock)!</b>\n");
                    hasSoldOut = true;
                } else if (remainingStock <= 3) {
                    sb.append("   ⚠️ <b>INVENTORY: LOW STOCK (").append(remainingStock).append(" left)</b>\n");
                } else {
                    sb.append("   ✅ <b>Stock remaining:</b> ").append(remainingStock).append(" units\n");
                }
                sb.append("\n");
            }

            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("📊 <b>Total Quantity:</b> ").append(totalQty).append(" items\n");
            sb.append("💰 <b>TOTAL PAID: $").append(order.getTotalAmount()).append("</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

            if (hasSoldOut) {
                sb.append("\n⚠️ <b>ACTION REQUIRED: One or more products are now SOLD OUT!</b>\n");
            }

            boolean sent = sendMessage(chatId, sb.toString());
            if (sent) {
                log.info("Telegram notification successfully sent for Order #{}", order.getId());
            } else {
                log.warn("Telegram notification could not be delivered for Order #{}", order.getId());
            }
        } catch (Exception e) {
            log.error("Failed to compile and dispatch Telegram order notification", e);
        }
    }

    public void sendInquiryNotification(com.example.ecommerce.model.ContactInquiry inquiry) {
        if (!enabled || botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            return;
        }

        try {
            StringBuilder sb = new StringBuilder();
            sb.append("📩 <b>NEW PROJECT INQUIRY RECEIVED!</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("👤 <b>Name:</b> ").append(escapeHtml(inquiry.getName())).append("\n");
            sb.append("📧 <b>Email:</b> ").append(escapeHtml(inquiry.getEmail())).append("\n");
            if (inquiry.getPhone() != null && !inquiry.getPhone().isBlank()) {
                sb.append("📱 <b>Phone:</b> ").append(escapeHtml(inquiry.getPhone())).append("\n");
            }
            sb.append("🛠 <b>Service Type:</b> ").append(escapeHtml(inquiry.getServiceType())).append("\n\n");
            sb.append("📝 <b>Project Details:</b>\n");
            sb.append(escapeHtml(inquiry.getMessage())).append("\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

            sendMessage(chatId, sb.toString());
        } catch (Exception e) {
            log.error("Failed to send inquiry Telegram notification", e);
        }
    }

    public boolean sendMessage(String targetChatId, String htmlText) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            String form = "chat_id=" + URLEncoder.encode(targetChatId, StandardCharsets.UTF_8)
                    + "&text=" + URLEncoder.encode(htmlText, StandardCharsets.UTF_8)
                    + "&parse_mode=HTML";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.error("Error executing Telegram sendMessage API request", e);
            return false;
        }
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;");
    }
}
