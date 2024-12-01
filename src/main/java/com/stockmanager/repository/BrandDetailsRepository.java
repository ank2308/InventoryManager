package com.stockmanager.repository;

import com.stockmanager.model.BrandDetails;
import com.stockmanager.model.Quantity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandDetailsRepository extends JpaRepository<BrandDetails, Long> {

    List<BrandDetails> findByBrandType(String brandType);

    @Query("SELECT DISTINCT b.brandType FROM BrandDetails b")
    List<String> findAllBrandTypes();

    @Query("SELECT DISTINCT b.brandType FROM BrandDetails b")
    List<String> findAllBrandNamesByType(String brandType);

    @Query("SELECT q FROM Quantity q " +
            "JOIN BrandQuantityMapping bqm ON bqm.quantity.id = q.id " +
            "JOIN BrandDetails bd ON bd.id = bqm.brandDetails.id " +
            "WHERE bd.brandName = :brandName")
    List<Quantity> findQuantitiesByBrandName(@Param("brandName") String brandName);

    List<BrandDetails> findByBrandName(String brandName);
    List<BrandDetails> findByBrandNameContainingIgnoreCase(String brandName);

    @Query("SELECT b.brandName FROM BrandDetails b WHERE LOWER(b.brandName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findBrandNamesContainingIgnoreCase(@Param("query") String query);
}
