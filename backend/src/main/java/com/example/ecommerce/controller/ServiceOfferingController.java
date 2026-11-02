package com.example.ecommerce.controller;

import com.example.ecommerce.model.ServiceOffering;
import com.example.ecommerce.repository.ServiceOfferingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceOfferingController {

    private final ServiceOfferingRepository serviceOfferingRepository;

    @GetMapping
    public ResponseEntity<List<ServiceOffering>> getAllActiveServices() {
        return ResponseEntity.ok(serviceOfferingRepository.findByActiveTrue());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceOffering> createService(@RequestBody ServiceOffering serviceOffering) {
        return ResponseEntity.ok(serviceOfferingRepository.save(serviceOffering));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceOffering> updateService(@PathVariable Long id, @RequestBody ServiceOffering updated) {
        ServiceOffering service = serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found: " + id));

        service.setTitle(updated.getTitle());
        service.setSummary(updated.getSummary());
        service.setDescription(updated.getDescription());
        service.setIcon(updated.getIcon());
        service.setActive(updated.isActive());

        return ResponseEntity.ok(serviceOfferingRepository.save(service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceOfferingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
