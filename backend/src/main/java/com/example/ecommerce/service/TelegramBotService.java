package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
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

@Service
@Slf4j
public class TelegramBotService {

    @Value("${telegram.bot.token:9174688661:AAG5lxoAuv1CgapUdqR6c59jsnj1mfKTTNM}")
    private String botToken;

    @Value("${telegram.bot.chat-id:1263944701}")
    private String chatId;

    @Value("${telegram.bot.username:EcommerceMoneyBot}")
    private String botUsername;

    @Value("${telegram.bot.enabled:true}")
    private boolean enabled;

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

    public void sendOrderNotification(Order order) {
        if (!enabled || botToken == null || botToken.isBlank()) {
            log.info("Telegram notification skipped: disabled or missing bot token");
            return;
        }

        // 1. Send Admin / Merchant Notification to store owner (chatId)
        if (chatId != null && !chatId.isBlank()) {
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

                boolean sent = sendMessage(chatId, sb.toString());
                if (sent) {
                    log.info("Telegram admin notification sent for Order #{}", order.getId());
                } else {
                    log.warn("Telegram admin notification could not be delivered for Order #{}", order.getId());
                }
            } catch (Exception e) {
                log.error("Failed to compile and dispatch Telegram admin notification", e);
            }
        }

        // 2. Also send dedicated customer order receipt to the user's Telegram Chat ID if provided
        String customerChatId = order.getTelegramChatId();
        if ((customerChatId == null || customerChatId.isBlank()) && order.getUser() != null) {
            customerChatId = order.getUser().getTelegramChatId();
        }

        if (customerChatId != null && !customerChatId.isBlank()) {
            sendCustomerOrderNotification(order, customerChatId);
        }
    }

    public void sendCustomerOrderNotification(Order order, String customerChatId) {
        if (!enabled || botToken == null || botToken.isBlank() || customerChatId == null || customerChatId.isBlank()) {
            return;
        }

        try {
            StringBuilder sb = new StringBuilder();
            String customerOrderId = String.format("JH-%04d", order.getId());
            sb.append("🛍 <b>YOUR ORDER CONFIRMATION #").append(customerOrderId).append("</b>\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            if (order.getUser() != null && order.getUser().getFullName() != null) {
                sb.append("👋 Hello <b>").append(escapeHtml(order.getUser().getFullName())).append("</b>,\n");
                sb.append("Thank you for shopping with JomnenhKh! Here is the summary of what you ordered:\n\n");
            } else {
                sb.append("Thank you for your order! Here is your purchase summary:\n\n");
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
            sb.append("🚚 <b>Status:</b> ").append(order.getOrderStatus() != null ? order.getOrderStatus() : "CONFIRMED").append("\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("✅ <i>Your order is verified and our dispatch team has received your instructions.</i>\n\n");
            sb.append("🌐 Visit your order history anytime: http://localhost:3000/settings\n");
            sb.append("💬 Need assistance? Contact JomnenhKh Support on Telegram: @EcommerceMoneyBot");

            boolean sent = sendMessage(customerChatId.trim(), sb.toString());
            if (sent) {
                log.info("Customer Telegram receipt successfully delivered to chat {} for Order #{}", customerChatId, order.getId());
            } else {
                log.warn("Customer Telegram receipt could not be delivered to chat {} for Order #{}", customerChatId, order.getId());
            }
        } catch (Exception e) {
            log.error("Failed to send customer Telegram notification", e);
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

    /**
     * Poll incoming Telegram messages so when a user sends /start, /order <id>, or clicks
     * https://t.me/EcommerceMoneyBot?start=order_<id>, the bot instantly returns their order receipt!
     */
    @Scheduled(fixedDelay = 4000)
    public void pollTelegramUpdates() {
        if (!enabled || botToken == null || botToken.isBlank()) {
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

                    JsonNode messageNode = update.path("message");
                    if (messageNode.isMissingNode()) continue;

                    String text = messageNode.path("text").asText("").trim();
                    JsonNode chatNode = messageNode.path("chat");
                    String userChatId = chatNode.path("id").asText();

                    if (userChatId == null || userChatId.isBlank() || text.isBlank()) continue;

                    handleIncomingUserMessage(userChatId, text);
                }
            }
        } catch (Exception ignored) {
            // Silently ignore network timeouts or offline environments
        }
    }

    private void handleIncomingUserMessage(String userChatId, String text) {
        String lower = text.toLowerCase();

        // 1. Check for Order lookups: /start order_123, /order 123, or order_123
        Long targetOrderId = null;
        if (lower.startsWith("/start order_")) {
            String idStr = text.substring("/start order_".length()).trim();
            targetOrderId = parseLongSafe(idStr);
        } else if (lower.startsWith("/order")) {
            String idStr = text.substring("/order".length()).replace("#", "").trim();
            targetOrderId = parseLongSafe(idStr);
        } else if (lower.startsWith("order_")) {
            String idStr = text.substring("order_".length()).trim();
            targetOrderId = parseLongSafe(idStr);
        } else if (text.matches("^#?\\d+$")) {
            targetOrderId = parseLongSafe(text.replace("#", "").trim());
        }

        if (targetOrderId != null && orderRepository != null) {
            Order order = orderRepository.findById(targetOrderId).orElse(null);
            if (order != null) {
                // Link telegramChatId to order and user if not set
                if (order.getTelegramChatId() == null || order.getTelegramChatId().isBlank()) {
                    order.setTelegramChatId(userChatId);
                    orderRepository.save(order);
                }
                if (order.getUser() != null && (order.getUser().getTelegramChatId() == null || order.getUser().getTelegramChatId().isBlank()) && userRepository != null) {
                    User u = order.getUser();
                    u.setTelegramChatId(userChatId);
                    userRepository.save(u);
                }

                sendCustomerOrderNotification(order, userChatId);
                return;
            } else {
                sendMessage(userChatId, "❌ <b>Order #" + targetOrderId + " not found.</b>\nPlease check your Order ID and try again, or view your orders at http://localhost:3000/settings");
                return;
            }
        }

        // 2. Greeting or Help: /start or /help
        if (lower.startsWith("/start") || lower.startsWith("/help")) {
            StringBuilder welcome = new StringBuilder();
            welcome.append("👋 <b>Welcome to JomnenhKH-Shop Telegram Bot (@EcommerceMoneyBot)!</b>\n\n");
            welcome.append("Your unique Telegram Chat ID is: <code>").append(userChatId).append("</code>\n\n");
            welcome.append("📋 <b>Available Commands:</b>\n");
            welcome.append("• <code>/order &lt;id&gt;</code> - View your order summary (e.g. <code>/order 1</code>)\n");
            welcome.append("• Visit our web store: http://localhost:3000\n\n");
            welcome.append("💡 <i>Tip: Add your Chat ID (<code>").append(userChatId).append("</code>) in your Account Settings or at Checkout to receive automated receipts for every order!</i>");

            sendMessage(userChatId, welcome.toString());
        }
    }

    private Long parseLongSafe(String str) {
        try {
            return Long.parseLong(str.trim());
        } catch (Exception e) {
            return null;
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
