package com.example.ecommerce.controller;

import com.example.ecommerce.dto.InquiryRequest;
import com.example.ecommerce.model.ContactInquiry;
import com.example.ecommerce.repository.ContactInquiryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final ContactInquiryRepository contactInquiryRepository;

    @PostMapping
    public ResponseEntity<ContactInquiry> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        ContactInquiry inquiry = ContactInquiry.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .serviceType(request.getServiceType())
                .message(request.getMessage())
                .status("NEW")
                .build();

        return ResponseEntity.ok(contactInquiryRepository.save(inquiry));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactInquiry>> getInquiries() {
        return ResponseEntity.ok(contactInquiryRepository.findAllByOrderByCreatedAtDesc());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactInquiry> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        ContactInquiry inquiry = contactInquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found: " + id));
        inquiry.setStatus(status);
        return ResponseEntity.ok(contactInquiryRepository.save(inquiry));
    }
}
