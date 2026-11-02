package com.example.ecommerce.repository;

import com.example.ecommerce.model.PortfolioProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findAllByOrderByCompletedDateDesc();
}
