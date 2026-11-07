package com.example.ecommerce;

import com.example.ecommerce.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class EcommerceApplicationTests {

    @Autowired
    private EmailService emailService;

    @Test
    void contextLoads() {
    }

    @Test
    void testGmailConnection() {
        boolean sent = emailService.sendTestEmail("hongsaoleang@gmail.com");
        assertTrue(sent, "Email should be sent successfully via Gmail SMTP");
    }
}
