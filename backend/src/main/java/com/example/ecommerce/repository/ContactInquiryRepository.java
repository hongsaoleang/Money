package com.example.ecommerce.repository;

import com.example.ecommerce.model.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {
    List<ContactInquiry> findAllByOrderByCreatedAtDesc();
}
