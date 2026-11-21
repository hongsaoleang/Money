package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@Service
@Slf4j
public class TelegramBotService {

    @Value("${telegram.bot.token:9174688661:AAG5lxoAuv1CgapUdqR6c59jsnj1mfKTTNM}")
    private String botToken;

    @Value("${telegram.bot.chat-id:1263944701}")
    private String adminChatId;

    @Value("${telegram.bot.username:EcommerceMoneyBot}")
    private String botUsername;

    @Value("${telegram.bot.enabled:true}")
    private boolean enabled;

    @Autowired
    @Lazy
    private TelegramUpdateHandler updateHandler;

    @Autowired
    @Lazy
    private TelegramLinkTokenService linkTokenService;

    @Autowired
    @Lazy
    private OrderRepository orderRepository;

    @Autowired
    @Lazy
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private long lastUpdateId = 0;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String getBotUsername() {
        return botUsername;
    }

    public String getAdminChatId() {
        return adminChatId;
    }

    public boolean isEnabled() {
        return enabled && botToken != null && !botToken.isBlank();
    }

    /**
     * Send order notifications:
     * 1. Rich Admin notification with inline management buttons (Confirm, Processing, Shipped, Completed, Cancel)
     * 2. Customer order confirmation if customerChatId is already linked
     */
    public void sendOrderNotification(Order order) {
        if (!isEnabled()) {
            log.info("Telegram notification skipped: disabled or missing bot token");
            return;
        }

        // 1. Send Admin / Merchant Notification with Action Buttons
        sendAdminOrderAlert(order);

        // 2. Also send dedicated customer order receipt if customer chat ID is linked
        String customerChatId = order.getTelegramChatId();
        if ((customerChatId == null || customerChatId.isBlank()) && order.getUser() != null) {
            customerChatId = order.getUser().getTelegramChatId();
        }

        if (customerChatId != null && !customerChatId.isBlank()) {
            sendCustomerOrderNotification(order, customerChatId);
        }
    }

    /**
     * Dispatches order alert to Admin (Hong Saoleang) with interactive management buttons
     */
    public void sendAdminOrderAlert(Order order) {
        if (adminChatId == null || adminChatId.isBlank()) {
            return;
        }

        try {
            StringBuilder sb = new StringBuilder();
            String formattedId = String.format("JH-%04d", order.getId());
            sb.append("🛍 <b>JomnenhKh Admin Notifications</b>\n");
            sb.append("<b>NEW ORDER RECEIVED</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("🆔 <b>Order ID:</b> #").append(formattedId).append("\n");

            if (order.getUser() != null) {
                sb.append("👤 <b>Customer:</b> ")
                  .append(escapeHtml(order.getUser().getFullName()))
                  .append(" (").append(escapeHtml(order.getUser().getEmail())).append(")\n");
            } else {
                sb.append("👤 <b>Customer (Guest):</b> ")
                  .append(escapeHtml(order.getCustomerName() != null ? order.getCustomerName() : "Guest"))
                  .append("\n");
            }

            String phone = order.getPhoneNumber();
            if ((phone == null || phone.isBlank()) && order.getUser() != null) {
                phone = order.getUser().getPhone();
            }
            if (phone != null && !phone.isBlank()) {
                sb.append("📞 <b>Phone Number:</b> ").append(escapeHtml(phone)).append("\n");
            }

            if (order.getCustomerContact() != null && !order.getCustomerContact().isBlank()
                    && !order.getCustomerContact().equalsIgnoreCase(phone)) {
                sb.append("💬 <b>Telegram / Contact:</b> ").append(escapeHtml(order.getCustomerContact())).append("\n");
            }

            if (order.getShippingAddress() != null && !order.getShippingAddress().isBlank()) {
                sb.append("📍 <b>Destination:</b> ")
                  .append(escapeHtml(order.getShippingAddress())).append("\n");
            }

            sb.append("💳 <b>Payment Status:</b> ").append(order.getPaymentStatus() != null ? order.getPaymentStatus() : "PAID").append("\n");
            sb.append("🚚 <b>Order Status:</b> ").append(order.getOrderStatus() != null ? order.getOrderStatus() : "CONFIRMED").append("\n");

            sb.append("\n📦 <b>ORDERED PRODUCTS:</b>\n");
            boolean hasSoldOut = false;
            int totalQty = 0;

            if (order.getItems() != null) {
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
            }

            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("📊 <b>Total Quantity:</b> ").append(totalQty).append(" items\n");
            sb.append("💰 <b>TOTAL: $").append(order.getTotalAmount()).append(" USD</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

            if (hasSoldOut) {
                sb.append("\n⚠️ <b>ACTION REQUIRED: One or more products are now SOLD OUT!</b>\n");
            }

            // Inline keyboard for order lifecycle actions
            Map<String, Object> replyMarkup = buildAdminOrderKeyboard(order.getId());
            sendMessageWithKeyboard(adminChatId, sb.toString(), replyMarkup);
            log.info("Admin order alert dispatched for Order #{}", order.getId());
        } catch (Exception e) {
            log.error("Failed to compile and dispatch Telegram admin notification", e);
        }
    }

    /**
     * Builds interactive keyboard for admin to update order statuses
     */
    public Map<String, Object> buildAdminOrderKeyboard(Long orderId) {
        List<List<Map<String, String>>> keyboard = new ArrayList<>();

        List<Map<String, String>> row1 = new ArrayList<>();
        row1.add(Map.of("text", "✅ Confirm Order", "callback_data", "adm_status:" + orderId + ":CONFIRMED"));
        row1.add(Map.of("text", "⚙️ Processing", "callback_data", "adm_status:" + orderId + ":PROCESSING"));
        keyboard.add(row1);

        List<Map<String, String>> row2 = new ArrayList<>();
        row2.add(Map.of("text", "🚚 Shipped", "callback_data", "adm_status:" + orderId + ":SHIPPED"));
        row2.add(Map.of("text", "🎉 Completed", "callback_data", "adm_status:" + orderId + ":COMPLETED"));
        keyboard.add(row2);

        List<Map<String, String>> row3 = new ArrayList<>();
        row3.add(Map.of("text", "❌ Cancel Order", "callback_data", "adm_status:" + orderId + ":CANCELLED"));
        keyboard.add(row3);

        return Map.of("inline_keyboard", keyboard);
    }

    /**
     * Sends customer-facing order summary with customer navigation buttons
     */
    public void sendCustomerOrderNotification(Order order, String customerChatId) {
        if (!isEnabled() || customerChatId == null || customerChatId.isBlank()) {
            return;
        }

        try {
            StringBuilder sb = new StringBuilder();
            String customerOrderId = String.format("JH-%04d", order.getId());
            sb.append("🛍 <b>YOUR ORDER CONFIRMATION #").append(customerOrderId).append("</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            if (order.getUser() != null && order.getUser().getFullName() != null) {
                sb.append("👋 Hello <b>").append(escapeHtml(order.getUser().getFullName())).append("</b>,\n");
                sb.append("Thank you for shopping with JomnenhKh! Here is your purchase summary:\n\n");
            } else {
                sb.append("Thank you for choosing JomnenhKh! Here is your purchase summary:\n\n");
            }

            sb.append("🆔 <b>Order ID:</b> #").append(customerOrderId).append("\n");
            if (order.getShippingAddress() != null && !order.getShippingAddress().isBlank()) {
                sb.append("📍 <b>Shipping Address:</b> ")
                  .append(escapeHtml(order.getShippingAddress())).append("\n");
            }
            if (order.getEstimatedDeliveryDate() != null) {
                sb.append("📅 <b>Estimated Arrival:</b> ")
                  .append(order.getEstimatedDeliveryDate().toLocalDate().toString()).append(" (within 4 days)\n");
            }

            sb.append("\n📦 <b>ORDERED ITEMS:</b>\n");
            int totalQty = 0;
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    totalQty += qty;
                    BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));

                    sb.append(" • <b>").append(escapeHtml(product.getName())).append("</b>\n");
                    sb.append("   - Quantity: ").append(qty).append(" unit(s)\n");
                    sb.append("   - Price: $").append(unitPrice).append(" (Subtotal: $").append(lineTotal).append(")\n\n");
                }
            }

            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("📊 <b>Total Items:</b> ").append(totalQty).append(" units\n");
            sb.append("💰 <b>TOTAL AMOUNT: $").append(order.getTotalAmount()).append(" USD</b>\n");
            sb.append("💳 <b>Payment Status:</b> ").append(order.getPaymentStatus() != null ? order.getPaymentStatus() : "PAID").append("\n");
            sb.append("🚚 <b>Order Status:</b> ").append(order.getOrderStatus() != null ? order.getOrderStatus() : "CONFIRMED").append("\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("✅ <i>Your order is verified. Our dispatch team is preparing your package.</i>");

            Map<String, Object> keyboard = buildCustomerMenuKeyboard();
            sendMessageWithKeyboard(customerChatId.trim(), sb.toString(), keyboard);
            log.info("Customer Telegram receipt delivered to chat {} for Order #{}", customerChatId, order.getId());
        } catch (Exception e) {
            log.error("Failed to send customer Telegram notification", e);
        }
    }

    /**
     * Notifies customer when admin updates their order status
     */
    public void sendCustomerOrderStatusUpdate(Order order, String newStatus) {
        String customerChatId = order.getTelegramChatId();
        if (customerChatId == null || customerChatId.isBlank()) {
            return;
        }

        try {
            String formattedId = String.format("JH-%04d", order.getId());
            String icon = switch (newStatus.toUpperCase()) {
                case "CONFIRMED" -> "✅";
                case "PROCESSING" -> "⚙️";
                case "SHIPPED" -> "🚚";
                case "COMPLETED" -> "🎉";
                case "CANCELLED" -> "❌";
                default -> "📦";
            };

            StringBuilder sb = new StringBuilder();
            sb.append("🔔 <b>Order Status Update</b>\n\n");
            sb.append("Your order <b>#").append(formattedId).append("</b> has been updated to:\n");
            sb.append("<b>").append(newStatus).append("</b> ").append(icon).append("\n\n");

            if ("SHIPPED".equalsIgnoreCase(newStatus)) {
                sb.append("🚀 Your package is on the way! Our courier is handling your delivery.\n");
            } else if ("PROCESSING".equalsIgnoreCase(newStatus)) {
                sb.append("📦 Our warehouse team is packaging your order with care.\n");
            } else if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                sb.append("✨ Thank you for shopping with JomnenhKh! We hope you love your purchase.\n");
            } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                sb.append("ℹ️ This order has been cancelled. If you have questions, please reach out to Support.\n");
            }

            sb.append("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            List<List<Map<String, String>>> keyboard = List.of(
                    List.of(
                            Map.of("text", "🚚 Track This Order", "callback_data", "cust_track:" + order.getId()),
                            Map.of("text", "💬 Contact Support", "callback_data", "cust_support")
                    )
            );

            sendMessageWithKeyboard(customerChatId, sb.toString(), Map.of("inline_keyboard", keyboard));
        } catch (Exception e) {
            log.error("Failed to notify customer of status update", e);
        }
    }

    /**
     * Builds main navigation keyboard for customer
     */
    public Map<String, Object> buildCustomerMenuKeyboard() {
        List<List<Map<String, String>>> keyboard = new ArrayList<>();

        List<Map<String, String>> row1 = new ArrayList<>();
        row1.add(Map.of("text", "📦 My Orders", "callback_data", "cust_orders"));
        row1.add(Map.of("text", "💳 Payment Status", "callback_data", "cust_payment"));
        keyboard.add(row1);

        List<Map<String, String>> row2 = new ArrayList<>();
        row2.add(Map.of("text", "🚚 Track My Order", "callback_data", "cust_track"));
        row2.add(Map.of("text", "💬 Contact Support", "callback_data", "cust_support"));
        keyboard.add(row2);

        return Map.of("inline_keyboard", keyboard);
    }

    public void sendInquiryNotification(com.example.ecommerce.model.ContactInquiry inquiry) {
        if (!isEnabled() || adminChatId == null || adminChatId.isBlank()) {
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

            sendMessage(adminChatId, sb.toString());
        } catch (Exception e) {
            log.error("Failed to send inquiry Telegram notification", e);
        }
    }

    /**
     * Continuous polling for local development so all features work seamlessly without a public webhook
     */
    @Scheduled(fixedDelay = 4000)
    public void pollTelegramUpdates() {
        if (!isEnabled()) {
            return;
        }

        try {
            String url = "https://api.telegram.org/bot" + botToken + "/getUpdates?offset=" + (lastUpdateId + 1) + "&timeout=2";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(6))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200 || response.body() == null || response.body().isBlank()) {
                return;
            }

            JsonNode root = objectMapper.readTree(response.body());
            if (!root.path("ok").asBoolean(false)) {
                return;
            }

            JsonNode updates = root.path("result");
            if (updates.isArray()) {
                for (JsonNode update : updates) {
                    long updateId = update.path("update_id").asLong();
                    if (updateId > lastUpdateId) {
                        lastUpdateId = updateId;
                    }

                    if (updateHandler != null) {
                        updateHandler.processUpdate(update);
                    }
                }
            }
        } catch (Exception ignored) {
            // Silently ignore network timeouts or transient connection glitches
        }
    }

    public boolean sendMessage(String targetChatId, String htmlText) {
        return sendMessageWithKeyboard(targetChatId, htmlText, null);
    }

    public boolean sendMessageWithKeyboard(String targetChatId, String htmlText, Map<String, Object> replyMarkup) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            Map<String, Object> payload = new HashMap<>();
            payload.put("chat_id", targetChatId);
            payload.put("text", htmlText);
            payload.put("parse_mode", "HTML");
            if (replyMarkup != null) {
                payload.put("reply_markup", replyMarkup);
            }

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.error("Error executing Telegram sendMessage API request", e);
            return false;
        }
    }

    public boolean editMessageText(String targetChatId, long messageId, String htmlText, Map<String, Object> replyMarkup) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/editMessageText";
            Map<String, Object> payload = new HashMap<>();
            payload.put("chat_id", targetChatId);
            payload.put("message_id", messageId);
            payload.put("text", htmlText);
            payload.put("parse_mode", "HTML");
            if (replyMarkup != null) {
                payload.put("reply_markup", replyMarkup);
            }

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.error("Error executing Telegram editMessageText API request", e);
            return false;
        }
    }

    public boolean answerCallbackQuery(String callbackQueryId, String text, boolean showAlert) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/answerCallbackQuery";
            Map<String, Object> payload = new HashMap<>();
            payload.put("callback_query_id", callbackQueryId);
            if (text != null && !text.isBlank()) {
                payload.put("text", text);
            }
            payload.put("show_alert", showAlert);

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.error("Error executing Telegram answerCallbackQuery API request", e);
            return false;
        }
    }

    public String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;");
    }
}
