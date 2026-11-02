package com.example.ecommerce.controller;

import com.example.ecommerce.model.PortfolioProject;
import com.example.ecommerce.repository.PortfolioProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioProjectController {

    private final PortfolioProjectRepository portfolioProjectRepository;

    @GetMapping
    public ResponseEntity<List<PortfolioProject>> getPortfolioProjects() {
        return ResponseEntity.ok(portfolioProjectRepository.findAllByOrderByCompletedDateDesc());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioProject> createPortfolioProject(@RequestBody PortfolioProject project) {
        return ResponseEntity.ok(portfolioProjectRepository.save(project));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioProject> updatePortfolioProject(
            @PathVariable Long id,
            @RequestBody PortfolioProject updated
    ) {
        PortfolioProject project = portfolioProjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio project not found: " + id));

        project.setTitle(updated.getTitle());
        project.setDescription(updated.getDescription());
        project.setTechStack(updated.getTechStack());
        project.setClientName(updated.getClientName());
        project.setLiveUrl(updated.getLiveUrl());
        project.setImageUrl(updated.getImageUrl());
        project.setCompletedDate(updated.getCompletedDate());

        return ResponseEntity.ok(portfolioProjectRepository.save(project));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePortfolioProject(@PathVariable Long id) {
        portfolioProjectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
