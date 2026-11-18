package com.example.ecommerce.controller;

import com.example.ecommerce.service.BakongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment/bakong")
@RequiredArgsConstructor
public class BakongPaymentController {

    private final BakongService bakongService;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        return ResponseEntity.ok(bakongService.getMerchantConfig());
    }

    @PostMapping("/check-status")
    public ResponseEntity<Map<String, Object>> checkStatus(@RequestBody Map<String, String> request) {
        String md5 = request.get("md5");
        if (md5 == null || md5.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "md5 parameter is required"));
        }
        return ResponseEntity.ok(bakongService.checkTransactionByMd5(md5.trim()));
    }
}
