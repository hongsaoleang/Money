package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.TelegramCustomer;
import com.example.ecommerce.model.TelegramSupportMessage;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.TelegramCustomerRepository;
import com.example.ecommerce.repository.TelegramSupportMessageRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramUpdateHandler {

    private final TelegramCustomerRepository customerRepository;
    private final TelegramSupportMessageRepository supportMessageRepository;
    private final OrderRepository orderRepository;
    private final TelegramLinkTokenService linkTokenService;

    @Lazy
    private final TelegramBotService botService;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional
    public void processUpdate(JsonNode update) {
        try {
            if (update.has("message")) {
                handleIncomingMessage(update.path("message"));
            } else if (update.has("callback_query")) {
                handleCallbackQuery(update.path("callback_query"));
            }
        } catch (Exception e) {
            log.error("Error processing Telegram update", e);
        }
    }

    private void handleIncomingMessage(JsonNode messageNode) {
        String chatId = messageNode.path("chat").path("id").asText("");
        if (chatId.isBlank()) return;

        String text = messageNode.path("text").asText("").trim();
        JsonNode fromNode = messageNode.path("from");
        String firstName = fromNode.path("first_name").asText("");
        String username = fromNode.path("username").asText("");
        String senderId = fromNode.path("id").asText("");

        // Register or refresh customer record
        TelegramCustomer customer = customerRepository.findByTelegramChatId(chatId)
                .orElseGet(() -> TelegramCustomer.builder()
                        .telegramChatId(chatId)
                        .customerName(firstName)
                        .telegramUsername(username)
                        .conversationState("IDLE")
                        .active(true)
                        .build());

        customer.setLastActiveAt(LocalDateTime.now());
        if (username != null && !username.isBlank()) {
            customer.setTelegramUsername(username);
        }
        customerRepository.save(customer);

        String adminChatId = botService.getAdminChatId();
        boolean isAdmin = adminChatId != null && (chatId.equals(adminChatId) || senderId.equals(adminChatId));

        // 1. ADMIN COMMANDS
        if (isAdmin && text.startsWith("/reply ")) {
            handleAdminReply(chatId, text);
            return;
        }

        if (isAdmin && text.equalsIgnoreCase("/orders")) {
            handleAdminOrdersList(chatId);
            return;
        }

        // 2. /start COMMAND (with or without linking token)
        if (text.startsWith("/start")) {
            String arg = text.length() > 6 ? text.substring(6).trim() : "";
            if (!arg.isBlank()) {
                handleStartWithArgument(chatId, arg, username, firstName, customer);
                return;
            } else {
                sendWelcomeMenu(chatId, firstName);
                return;
            }
        }

        // 3. /help COMMAND
        if (text.equalsIgnoreCase("/help") || text.equalsIgnoreCase("/menu")) {
            sendWelcomeMenu(chatId, firstName);
            return;
        }

        // 4. CHECK CUSTOMER STATE (e.g. Awaiting Support Message)
        if ("AWAITING_SUPPORT_MESSAGE".equalsIgnoreCase(customer.getConversationState())) {
            handleCustomerSupportMessage(customer, text);
            return;
        }

        // 5. DIRECT ORDER ID LOOKUP: e.g. /order 1, #JH-0001, order_1
        Long targetOrderId = extractOrderId(text);
        if (targetOrderId != null) {
            handleDirectOrderLookup(chatId, targetOrderId);
            return;
        }

        // Default response: friendly guidance with menu
        sendWelcomeMenu(chatId, firstName);
    }

    private void handleStartWithArgument(String chatId, String arg, String username, String displayName, TelegramCustomer customer) {
        // Option A: Token-based linking (tok_...)
        if (arg.startsWith("tok_")) {
            Order order = linkTokenService.validateAndLinkToken(arg, chatId, username, displayName);
            if (order != null) {
                String formattedId = String.format("JH-%04d", order.getId());
                StringBuilder sb = new StringBuilder();
                sb.append("🎉 <b>Telegram Linked Successfully!</b>\n\n");
                sb.append("Your Telegram account is now connected to Order <b>#").append(formattedId).append("</b>.\n");
                sb.append("You will receive real-time delivery tracking alerts and order notifications right here!\n\n");
                sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

                botService.sendMessage(chatId, sb.toString());
                botService.sendCustomerOrderNotification(order, chatId);
                return;
            } else {
                botService.sendMessage(chatId,
                        "⚠️ <b>Tracking Link Notice</b>\n\n" +
                        "This order tracking link is either expired or already consumed.\n" +
                        "You can check your existing purchases anytime using the menu below.");
                sendWelcomeMenu(chatId, displayName);
                return;
            }
        }

        // Option B: order_<id> linking
        Long orderId = null;
        if (arg.startsWith("order_")) {
            try {
                orderId = Long.parseLong(arg.substring("order_".length()).trim());
            } catch (Exception ignored) {}
        } else {
            try {
                orderId = Long.parseLong(arg.trim());
            } catch (Exception ignored) {}
        }

        if (orderId != null) {
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null) {
                // If not yet linked, link to this chat
                if (order.getTelegramChatId() == null || order.getTelegramChatId().isBlank()) {
                    order.setTelegramChatId(chatId);
                    orderRepository.save(order);
                }

                // Verify ownership (security check)
                if (chatId.equals(order.getTelegramChatId())) {
                    botService.sendCustomerOrderNotification(order, chatId);
                    return;
                } else {
                    botService.sendMessage(chatId, "❌ <b>Order Security Notice:</b> You are not authorized to view this order.");
                    sendWelcomeMenu(chatId, displayName);
                    return;
                }
            }
        }

        sendWelcomeMenu(chatId, displayName);
    }

    private void sendWelcomeMenu(String chatId, String name) {
        StringBuilder sb = new StringBuilder();
        sb.append("👋 <b>Welcome to JomnenhKh!</b>\n\n");
        sb.append("Thank you for choosing us. You can use this bot to check your purchases, payment status, and delivery information.\n\n");
        sb.append("How can we help you today?");

        Map<String, Object> keyboard = botService.buildCustomerMenuKeyboard();
        botService.sendMessageWithKeyboard(chatId, sb.toString(), keyboard);
    }

    private void handleCustomerSupportMessage(TelegramCustomer customer, String text) {
        // Reset state
        customer.setConversationState("IDLE");
        customerRepository.save(customer);

        // Record support ticket
        TelegramSupportMessage supportMsg = TelegramSupportMessage.builder()
                .telegramChatId(customer.getTelegramChatId())
                .customerName(customer.getCustomerName())
                .telegramUsername(customer.getTelegramUsername())
                .message(text)
                .status("PENDING")
                .build();
        supportMessageRepository.save(supportMsg);

        // Forward to Admin (chatId: 1263944701)
        String adminChatId = botService.getAdminChatId();
        if (adminChatId != null && !adminChatId.isBlank()) {
            StringBuilder adminSb = new StringBuilder();
            adminSb.append("📩 <b>CUSTOMER SUPPORT MESSAGE RECEIVED</b>\n");
            adminSb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            adminSb.append("👤 <b>Customer:</b> ").append(botService.escapeHtml(customer.getCustomerName() != null ? customer.getCustomerName() : "Customer"));
            if (customer.getTelegramUsername() != null && !customer.getTelegramUsername().isBlank()) {
                adminSb.append(" (@").append(botService.escapeHtml(customer.getTelegramUsername())).append(")");
            }
            adminSb.append("\n");

            if (customer.getPhoneNumber() != null && !customer.getPhoneNumber().isBlank()) {
                adminSb.append("📞 <b>Phone:</b> ").append(botService.escapeHtml(customer.getPhoneNumber())).append("\n");
            }
            adminSb.append("🆔 <b>Telegram Chat ID:</b> <code>").append(customer.getTelegramChatId()).append("</code>\n\n");
            adminSb.append("💬 <b>Message:</b>\n");
            adminSb.append(botService.escapeHtml(text)).append("\n\n");
            adminSb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            adminSb.append("💡 <i>To reply to this customer via bot, type:</i>\n");
            adminSb.append("<code>/reply ").append(customer.getTelegramChatId()).append(" &lt;Your message here&gt;</code>");

            botService.sendMessage(adminChatId, adminSb.toString());
        }

        // Acknowledge to Customer
        StringBuilder custSb = new StringBuilder();
        custSb.append("✅ <b>Thank You for Contacting JomnenhKh Support!</b>\n\n");
        custSb.append("Your message has been received by our support team. We will review it and reply back to you right here in this chat shortly.\n\n");
        custSb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        List<List<Map<String, String>>> keyboard = List.of(
                List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu"))
        );

        botService.sendMessageWithKeyboard(customer.getTelegramChatId(), custSb.toString(), Map.of("inline_keyboard", keyboard));
    }

    private void handleAdminReply(String adminChatId, String text) {
        String parts = text.substring("/reply ".length()).trim();
        int firstSpace = parts.indexOf(' ');
        if (firstSpace == -1) {
            botService.sendMessage(adminChatId, "⚠️ <b>Usage:</b> <code>/reply &lt;CustomerChatId&gt; &lt;Your reply message&gt;</code>");
            return;
        }

        String targetChatId = parts.substring(0, firstSpace).trim();
        String replyMessage = parts.substring(firstSpace + 1).trim();

        if (replyMessage.isBlank()) {
            botService.sendMessage(adminChatId, "⚠️ Reply message cannot be blank.");
            return;
        }

        // Deliver reply to customer from the official business bot
        StringBuilder customerMsg = new StringBuilder();
        customerMsg.append("💬 <b>Message from JomnenhKh Support:</b>\n\n");
        customerMsg.append(botService.escapeHtml(replyMessage)).append("\n\n");
        customerMsg.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        customerMsg.append("<i>If you have any further questions, tap below to reply.</i>");

        List<List<Map<String, String>>> keyboard = List.of(
                List.of(Map.of("text", "💬 Reply to Support", "callback_data", "cust_support")),
                List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu"))
        );

        boolean sent = botService.sendMessageWithKeyboard(targetChatId, customerMsg.toString(), Map.of("inline_keyboard", keyboard));

        // Update pending support messages status in database
        List<TelegramSupportMessage> pending = supportMessageRepository.findByTelegramChatIdOrderByCreatedAtDesc(targetChatId);
        if (!pending.isEmpty()) {
            TelegramSupportMessage top = pending.get(0);
            top.setStatus(sent ? "REPLIED" : "DELIVERY_ATTEMPTED");
            top.setAdminReply(replyMessage);
            top.setRepliedAt(LocalDateTime.now());
            supportMessageRepository.save(top);
        }

        if (sent) {
            botService.sendMessage(adminChatId, "✅ <b>Reply successfully delivered</b> to Customer (Chat ID: <code>" + targetChatId + "</code>).");
        } else {
            botService.sendMessage(adminChatId, "⚠️ Attempted delivery to Chat ID: " + targetChatId + " recorded in database, but Telegram reported chat unreachable (e.g. invalid chat ID or bot blocked).");
        }
    }

    private void handleAdminOrdersList(String adminChatId) {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        if (orders.isEmpty()) {
            botService.sendMessage(adminChatId, "ℹ️ No orders in database yet.");
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📋 <b>JomnenhKh - Recent Orders (Admin Overview)</b>\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");

        int count = 0;
        for (Order o : orders) {
            if (++count > 8) break;
            String fId = String.format("JH-%04d", o.getId());
            sb.append("• <b>#").append(fId).append("</b> - $").append(o.getTotalAmount())
              .append(" (").append(o.getOrderStatus()).append(")\n");
            sb.append("  👤 ").append(botService.escapeHtml(o.getCustomerName() != null ? o.getCustomerName() : "Guest"));
            if (o.getPhoneNumber() != null && !o.getPhoneNumber().isBlank()) {
                sb.append(" | 📞 ").append(botService.escapeHtml(o.getPhoneNumber()));
            }
            sb.append("\n\n");
        }
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        botService.sendMessage(adminChatId, sb.toString());
    }

    private void handleDirectOrderLookup(String chatId, Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            botService.sendMessage(chatId, "❌ <b>Order #" + orderId + " not found.</b>\nPlease check your Order ID and try again.");
            return;
        }

        // Verify security: must match customer's chat ID
        if (order.getTelegramChatId() == null || order.getTelegramChatId().isBlank()) {
            order.setTelegramChatId(chatId);
            orderRepository.save(order);
        }

        if (chatId.equals(order.getTelegramChatId())) {
            botService.sendCustomerOrderNotification(order, chatId);
        } else {
            botService.sendMessage(chatId, "❌ <b>Security Notice:</b> You are not authorized to access this order.");
        }
    }

    private void handleCallbackQuery(JsonNode cbNode) {
        String queryId = cbNode.path("id").asText();
        String data = cbNode.path("data").asText("");
        JsonNode messageNode = cbNode.path("message");
        String chatId = messageNode.path("chat").path("id").asText();
        long messageId = messageNode.path("message_id").asLong();
        String senderId = cbNode.path("from").path("id").asText();

        String adminChatId = botService.getAdminChatId();
        boolean isAdmin = adminChatId != null && (chatId.equals(adminChatId) || senderId.equals(adminChatId));

        // 1. ADMIN ACTIONS: adm_status:<orderId>:<STATUS>
        if (data.startsWith("adm_status:")) {
            if (!isAdmin) {
                botService.answerCallbackQuery(queryId, "Unauthorized: Admin privileges required.", true);
                return;
            }

            handleAdminStatusUpdate(queryId, data, chatId, messageId);
            return;
        }

        // 2. CUSTOMER ACTIONS
        if ("cust_menu".equals(data)) {
            botService.answerCallbackQuery(queryId, "", false);
            sendWelcomeMenu(chatId, "");
            return;
        }

        if ("cust_orders".equals(data)) {
            botService.answerCallbackQuery(queryId, "", false);
            handleCustomerOrders(chatId);
            return;
        }

        if (data.startsWith("cust_track")) {
            botService.answerCallbackQuery(queryId, "", false);
            handleCustomerTrack(chatId, data);
            return;
        }

        if (data.startsWith("cust_payment")) {
            botService.answerCallbackQuery(queryId, "", false);
            handleCustomerPaymentStatus(chatId, data);
            return;
        }

        if ("cust_support".equals(data)) {
            botService.answerCallbackQuery(queryId, "", false);
            handleCustomerSupportPrompt(chatId);
            return;
        }
    }

    private void handleAdminStatusUpdate(String queryId, String data, String chatId, long messageId) {
        String[] parts = data.split(":");
        if (parts.length < 3) return;

        Long orderId = null;
        try {
            orderId = Long.parseLong(parts[1]);
        } catch (Exception ignored) {}

        if (orderId == null) return;
        String newStatus = parts[2].toUpperCase();

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            botService.answerCallbackQuery(queryId, "Order #" + orderId + " not found.", true);
            return;
        }

        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        String formattedId = String.format("JH-%04d", order.getId());
        botService.answerCallbackQuery(queryId, "Order #" + formattedId + " updated to " + newStatus + "!", false);

        // Notify customer on their linked private Telegram chat
        if (order.getTelegramChatId() != null && !order.getTelegramChatId().isBlank()) {
            botService.sendCustomerOrderStatusUpdate(order, newStatus);
        }

        // Refresh admin notification with updated status
        botService.sendAdminOrderAlert(order);
    }

    private void handleCustomerOrders(String chatId) {
        List<Order> orders = orderRepository.findByTelegramChatIdOrderByCreatedAtDesc(chatId);

        if (orders.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            sb.append("📦 <b>My Orders</b>\n\n");
            sb.append("You have no linked orders yet.\n\n");
            sb.append("💡 When you place an order on JomnenhKh, simply tap <b>Track Your Order on Telegram</b> to link it instantly!\n\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            List<List<Map<String, String>>> keyboard = List.of(
                    List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu"))
            );
            botService.sendMessageWithKeyboard(chatId, sb.toString(), Map.of("inline_keyboard", keyboard));
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📦 <b>My Purchases (").append(orders.size()).append(" Orders)</b>\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");

        List<List<Map<String, String>>> keyboard = new ArrayList<>();

        for (Order o : orders) {
            String fId = String.format("JH-%04d", o.getId());
            sb.append("🆔 <b>Order #").append(fId).append("</b>\n");
            sb.append("💰 <b>Total:</b> $").append(o.getTotalAmount()).append(" USD\n");
            sb.append("🚚 <b>Status:</b> ").append(o.getOrderStatus() != null ? o.getOrderStatus() : "CONFIRMED").append("\n");
            sb.append("💳 <b>Payment:</b> ").append(o.getPaymentStatus() != null ? o.getPaymentStatus() : "PAID").append("\n");

            if (o.getItems() != null && !o.getItems().isEmpty()) {
                sb.append("📦 <b>Items:</b> ");
                List<String> itemNames = o.getItems().stream()
                        .map(i -> i.getProduct().getName() + " (x" + i.getQuantity() + ")")
                        .toList();
                sb.append(botService.escapeHtml(String.join(", ", itemNames))).append("\n");
            }
            sb.append("\n");

            // Add action button for each order
            keyboard.add(List.of(
                    Map.of("text", "🚚 Track #" + fId, "callback_data", "cust_track:" + o.getId()),
                    Map.of("text", "💳 Payment #" + fId, "callback_data", "cust_payment:" + o.getId())
            ));
        }

        keyboard.add(List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu")));

        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("<i>Tap an order button below to track progress or inspect details.</i>");

        botService.sendMessageWithKeyboard(chatId, sb.toString(), Map.of("inline_keyboard", keyboard));
    }

    private void handleCustomerTrack(String chatId, String data) {
        Long targetId = null;
        if (data.contains(":")) {
            try {
                targetId = Long.parseLong(data.split(":")[1]);
            } catch (Exception ignored) {}
        }

        Order targetOrder = null;
        if (targetId != null) {
            targetOrder = orderRepository.findById(targetId).orElse(null);
        } else {
            List<Order> orders = orderRepository.findByTelegramChatIdOrderByCreatedAtDesc(chatId);
            if (!orders.isEmpty()) {
                targetOrder = orders.get(0);
            }
        }

        if (targetOrder == null) {
            botService.sendMessageWithKeyboard(chatId,
                    "🚚 <b>Track Order</b>\n\nNo orders found to track yet.",
                    Map.of("inline_keyboard", List.of(List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu")))));
            return;
        }

        // Security check
        if (!chatId.equals(targetOrder.getTelegramChatId())) {
            botService.sendMessage(chatId, "❌ You are not authorized to track this order.");
            return;
        }

        String formattedId = String.format("JH-%04d", targetOrder.getId());
        String currentStatus = targetOrder.getOrderStatus() != null ? targetOrder.getOrderStatus().toUpperCase() : "CONFIRMED";

        boolean isConfirmed = true;
        boolean isPaid = "PAID".equalsIgnoreCase(targetOrder.getPaymentStatus());
        boolean isProcessing = "PROCESSING".equals(currentStatus) || "SHIPPED".equals(currentStatus) || "COMPLETED".equals(currentStatus);
        boolean isShipped = "SHIPPED".equals(currentStatus) || "COMPLETED".equals(currentStatus);
        boolean isCompleted = "COMPLETED".equals(currentStatus);
        boolean isCancelled = "CANCELLED".equals(currentStatus);

        StringBuilder sb = new StringBuilder();
        sb.append("🚚 <b>LIVE ORDER TRACKING</b>\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        sb.append("🆔 <b>Order ID:</b> #").append(formattedId).append("\n");
        sb.append("💰 <b>Amount:</b> $").append(targetOrder.getTotalAmount()).append(" USD\n");
        if (targetOrder.getShippingAddress() != null) {
            sb.append("📍 <b>Destination:</b> ").append(botService.escapeHtml(targetOrder.getShippingAddress())).append("\n");
        }
        if (targetOrder.getEstimatedDeliveryDate() != null) {
            sb.append("📅 <b>Estimated Arrival:</b> ").append(targetOrder.getEstimatedDeliveryDate().toLocalDate()).append("\n");
        }
        sb.append("\n<b>Tracking Progress:</b>\n");

        if (isCancelled) {
            sb.append("❌ <b>Order Cancelled</b>\n");
            sb.append("Please contact support if you need assistance.\n");
        } else {
            sb.append(isConfirmed ? "✅" : "⏳").append(" <b>1. Order Received:</b> Confirmed\n");
            sb.append(isPaid ? "✅" : "⏳").append(" <b>2. Payment:</b> ").append(targetOrder.getPaymentStatus()).append("\n");
            sb.append(isProcessing ? "✅" : "⏳").append(" <b>3. Processing:</b> Preparing in warehouse\n");
            sb.append(isShipped ? "✅" : "⏳").append(" <b>4. Shipped:</b> In transit with courier\n");
            sb.append(isCompleted ? "✅" : "⏳").append(" <b>5. Completed:</b> Delivered to customer\n");
        }

        sb.append("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        List<List<Map<String, String>>> keyboard = List.of(
                List.of(
                        Map.of("text", "📦 My Orders", "callback_data", "cust_orders"),
                        Map.of("text", "💬 Support", "callback_data", "cust_support")
                ),
                List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu"))
        );

        botService.sendMessageWithKeyboard(chatId, sb.toString(), Map.of("inline_keyboard", keyboard));
    }

    private void handleCustomerPaymentStatus(String chatId, String data) {
        Long targetId = null;
        if (data.contains(":")) {
            try {
                targetId = Long.parseLong(data.split(":")[1]);
            } catch (Exception ignored) {}
        }

        Order targetOrder = null;
        if (targetId != null) {
            targetOrder = orderRepository.findById(targetId).orElse(null);
        } else {
            List<Order> orders = orderRepository.findByTelegramChatIdOrderByCreatedAtDesc(chatId);
            if (!orders.isEmpty()) {
                targetOrder = orders.get(0);
            }
        }

        if (targetOrder == null) {
            botService.sendMessageWithKeyboard(chatId,
                    "💳 <b>Payment Status</b>\n\nNo orders found to verify payment.",
                    Map.of("inline_keyboard", List.of(List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu")))));
            return;
        }

        if (!chatId.equals(targetOrder.getTelegramChatId())) {
            botService.sendMessage(chatId, "❌ You are not authorized to check payment for this order.");
            return;
        }

        String formattedId = String.format("JH-%04d", targetOrder.getId());
        String payStatus = targetOrder.getPaymentStatus() != null ? targetOrder.getPaymentStatus().toUpperCase() : "PAID";

        StringBuilder sb = new StringBuilder();
        sb.append("💳 <b>VERIFIED PAYMENT STATUS</b>\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        sb.append("🆔 <b>Order ID:</b> #").append(formattedId).append("\n");
        sb.append("💰 <b>Amount:</b> $").append(targetOrder.getTotalAmount()).append(" USD\n");
        sb.append("🏦 <b>Method:</b> KHQR / Bakong / Cash on Delivery\n");
        sb.append("📊 <b>Status:</b> ");

        switch (payStatus) {
            case "PAID" -> sb.append("✅ <b>PAID</b> (Verified)\n");
            case "PENDING" -> sb.append("⏳ <b>PENDING</b> (Awaiting confirmation)\n");
            case "FAILED" -> sb.append("❌ <b>FAILED</b>\n");
            case "REFUNDED" -> sb.append("🔄 <b>REFUNDED</b>\n");
            default -> sb.append("ℹ️ <b>").append(payStatus).append("</b>\n");
        }

        sb.append("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        List<List<Map<String, String>>> keyboard = List.of(
                List.of(
                        Map.of("text", "🚚 Track Order", "callback_data", "cust_track:" + targetOrder.getId()),
                        Map.of("text", "📦 My Orders", "callback_data", "cust_orders")
                ),
                List.of(Map.of("text", "⬅️ Main Menu", "callback_data", "cust_menu"))
        );

        botService.sendMessageWithKeyboard(chatId, sb.toString(), Map.of("inline_keyboard", keyboard));
    }

    private void handleCustomerSupportPrompt(String chatId) {
        TelegramCustomer customer = customerRepository.findByTelegramChatId(chatId).orElse(null);
        if (customer != null) {
            customer.setConversationState("AWAITING_SUPPORT_MESSAGE");
            customerRepository.save(customer);
        }

        StringBuilder sb = new StringBuilder();
        sb.append("💬 <b>JomnenhKh Customer Support</b>\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        sb.append("Please type your question or message directly into this chat.\n\n");
        sb.append("Our dedicated support team will receive your message and assist you right away!\n\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        List<List<Map<String, String>>> keyboard = List.of(
                List.of(Map.of("text", "❌ Cancel & Return to Menu", "callback_data", "cust_menu"))
        );

        botService.sendMessageWithKeyboard(chatId, sb.toString(), Map.of("inline_keyboard", keyboard));
    }

    private Long extractOrderId(String text) {
        try {
            String lower = text.toLowerCase().trim();
            if (lower.startsWith("/order ")) {
                return Long.parseLong(lower.substring("/order ".length()).replace("#", "").replace("jh-", "").trim());
            }
            if (lower.startsWith("order_")) {
                return Long.parseLong(lower.substring("order_".length()).trim());
            }
            if (lower.startsWith("#jh-") || lower.startsWith("jh-")) {
                return Long.parseLong(lower.replace("#jh-", "").replace("jh-", "").trim());
            }
            if (text.matches("^#?\\d+$")) {
                return Long.parseLong(text.replace("#", "").trim());
            }
        } catch (Exception ignored) {}
        return null;
    }
}
