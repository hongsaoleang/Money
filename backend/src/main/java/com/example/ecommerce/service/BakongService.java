package com.example.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class BakongService {

    @Value("${bakong.api.token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiZWZjM2ZhZTFhZWMxNDk3YSJ9LCJpYXQiOjE3OTUwMDcwMDIsImV4cCI6MTgwMjc4MzAwMn0.bokB_21w1aeTTY6M30iCc0R5HBtL9tQN_3KDM7hH9LU}")
    private String apiToken;

    @Value("${bakong.api.base-url:https://api-bakong.nbc.gov.kh/v1}")
    private String baseUrl;

    @Value("${bakong.account.id:hongsaoleang@aclb}")
    private String bakongAccountId;

    @Value("${bakong.merchant.name:Hong Saoleang}")
    private String merchantName;

    @Value("${bakong.merchant.city:Phnom Penh}")
    private String merchantCity;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> getMerchantConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("bakongAccountId", bakongAccountId);
        config.put("merchantName", merchantName);
        config.put("merchantCity", merchantCity);
        return config;
    }

    public Map<String, Object> checkTransactionByMd5(String md5) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = baseUrl + "/check_transaction_by_md5";
            Map<String, String> bodyMap = Map.of("md5", md5);
            String jsonPayload = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + apiToken)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Bakong check_transaction_by_md5 status: {}, body: {}", response.statusCode(), response.body());

            JsonNode root = objectMapper.readTree(response.body());
            int responseCode = root.path("responseCode").asInt(1);
            boolean isSuccess = (responseCode == 0);

            result.put("success", isSuccess);
            result.put("responseCode", responseCode);
            result.put("responseMessage", root.path("responseMessage").asText());
            result.put("data", root.path("data"));
            return result;
        } catch (Exception e) {
            log.error("Error verifying Bakong transaction with MD5: " + md5, e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
}
