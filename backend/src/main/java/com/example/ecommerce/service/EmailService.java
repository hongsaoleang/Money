package com.example.ecommerce.service;

import com.example.ecommerce.model.ContactInquiry;
import com.example.ecommerce.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:hongsaoleang@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.admin.email:hongsaoleang@gmail.com}")
    private String adminEmail;

    public boolean isConfigured() {
        return mailPassword != null && !mailPassword.trim().isEmpty();
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        if (!isConfigured()) {
            log.info("[Gmail Integration] Order #{} placed. (Configure GMAIL_APP_PASSWORD to send live Gmail)", order.getId());
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(order.getUser().getEmail());
            message.setCc(adminEmail);
            message.setSubject("NexusTech Order Confirmation - Order #" + order.getId());
            message.setText("Dear " + order.getUser().getFullName() + ",\n\n" +
                    "Thank you for your order on NexusTech!\n" +
                    "Order ID: #" + order.getId() + "\n" +
                    "Total Amount: $" + order.getTotalAmount() + "\n" +
                    "Status: " + order.getOrderStatus() + "\n" +
                    "Estimated Delivery: " + (order.getEstimatedDeliveryDate() != null ? order.getEstimatedDeliveryDate() : "5-7 Business Days") + "\n\n" +
                    "Best regards,\nNexusTech Automated Logistics");

            mailSender.send(message);
            log.info("[Gmail Integration] Sent order confirmation email for Order #{}", order.getId());
        } catch (Exception e) {
            log.error("[Gmail Integration] Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendInquiryNotification(ContactInquiry inquiry) {
        if (!isConfigured()) {
            log.info("[Gmail Integration] Inquiry received from {}: {}. (Configure GMAIL_APP_PASSWORD for live Gmail delivery)",
                    inquiry.getEmail(), inquiry.getServiceType());
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("[New Client Inquiry] " + inquiry.getName() + " - " + inquiry.getServiceType());
            message.setText("New Client Service Inquiry Received:\n\n" +
                    "Client Name: " + inquiry.getName() + "\n" +
                    "Email: " + inquiry.getEmail() + "\n" +
                    "Phone: " + (inquiry.getPhone() != null ? inquiry.getPhone() : "Not provided") + "\n" +
                    "Service Type: " + inquiry.getServiceType() + "\n\n" +
                    "Message:\n" + inquiry.getMessage());

            mailSender.send(message);
            log.info("[Gmail Integration] Sent inquiry alert email to {}", adminEmail);
        } catch (Exception e) {
            log.error("[Gmail Integration] Failed to send inquiry notification: {}", e.getMessage());
        }
    }

    public boolean sendTestEmail(String toEmail) {
        if (!isConfigured()) {
            log.warn("[Gmail Integration] Mail password not configured.");
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("NexusTech Gmail Integration - Test Success!");
            message.setText("Hello Hong Saoleang,\n\n" +
                    "Your NexusTech Gmail integration is working successfully!\n" +
                    "Authenticated with: " + fromEmail + "\n" +
                    "Timestamp: " + java.time.LocalDateTime.now() + "\n\n" +
                    "Automated order confirmations and customer service inquiries will now be sent directly through this address.\n\n" +
                    "Best regards,\nNexusTech E-Commerce Platform");

            mailSender.send(message);
            log.info("[Gmail Integration] Successfully sent test email to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.error("[Gmail Integration] Failed to send test email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send email via Gmail SMTP: " + e.getMessage(), e);
        }
    }
}
