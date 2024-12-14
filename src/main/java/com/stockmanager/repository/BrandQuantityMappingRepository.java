package com.stockmanager.repository;

import com.stockmanager.model.BrandDetails;
import com.stockmanager.model.BrandQuantityMapping;
import com.stockmanager.model.Quantity;
import com.stockmanager.model.BrandDetailsWithQuantitiesResponseDTO.QuantityNameWithMrpDTO;

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
    
    // @Query("SELECT q.quantity_name AS quantityName, bqm.mrp\n" + //
    //             "FROM stockmanagerdb.brand_quantity_mapping bqm\n" + //
    //             "LEFT JOIN Quantity q ON bqm.quantity_id = q.id\n" + //
    //             "WHERE bqm.id=:id")
    @Query("SELECT new com.stockmanager.model.BrandDetailsWithQuantitiesResponseDTO$QuantityNameWithMrpDTO(q.quantityName, q.quantity, bqm.mrp) FROM BrandQuantityMapping bqm JOIN bqm.quantity q WHERE bqm.id = :id")
    QuantityNameWithMrpDTO findBrandQuantityByMapping(@Param("id") Long id);
}
