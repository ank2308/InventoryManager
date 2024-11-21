package com.stockmanager.repository;

import com.stockmanager.model.BrandDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandDetailsRepository extends JpaRepository<BrandDetails, Long> {

    List<BrandDetails> findByBrandType(String brandType);

    @Query("SELECT DISTINCT b.brandType FROM BrandDetails b")
    List<String> findAllBrandTypes();

    @Query("SELECT DISTINCT b.brandType FROM BrandDetails b")
    List<String> findAllBrandNamesByType(String brandType);

}
