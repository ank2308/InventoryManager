package com.stockmanager.repository;

import com.stockmanager.model.BrandDetails;
import com.stockmanager.model.BrandQuantityMapping;
import com.stockmanager.model.Quantity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandQuantityMappingRepository extends JpaRepository<BrandQuantityMapping, Long> {

    List<BrandQuantityMapping> findByBrandDetails(BrandDetails brandDetails);
    Optional<Object> findByBrandDetailsAndQuantity(BrandDetails brandDetails, Quantity quantity);
    @Query("SELECT b FROM BrandQuantityMapping b where b.id=:id")
    BrandQuantityMapping findQuantityById(Long id);
}
