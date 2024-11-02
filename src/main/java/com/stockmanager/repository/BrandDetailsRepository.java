package com.stockmanager.repository;

import com.stockmanager.model.BrandDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandDetailsRepository extends JpaRepository<BrandDetails, Long> {

    List<BrandDetails> findByBrandType(String brandType);
}
