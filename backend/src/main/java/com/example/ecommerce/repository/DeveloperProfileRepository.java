package com.example.ecommerce.repository;

import com.example.ecommerce.model.DeveloperProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeveloperProfileRepository extends JpaRepository<DeveloperProfile, Long> {
    List<DeveloperProfile> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
