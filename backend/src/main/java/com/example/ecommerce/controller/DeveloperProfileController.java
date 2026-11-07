package com.example.ecommerce.controller;

import com.example.ecommerce.model.DeveloperProfile;
import com.example.ecommerce.repository.DeveloperProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/developers")
@RequiredArgsConstructor
public class DeveloperProfileController {
    private final DeveloperProfileRepository developerProfileRepository;

    @GetMapping
    public ResponseEntity<List<DeveloperProfile>> getActiveProfiles() {
        return ResponseEntity.ok(developerProfileRepository.findByActiveTrueOrderByDisplayOrderAscIdAsc());
    }
}
