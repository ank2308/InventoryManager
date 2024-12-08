package com.stockmanager.repository;

import com.stockmanager.model.BrandType;
import com.stockmanager.model.LiquorQuantity;
import com.stockmanager.model.StockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockDataRepository extends JpaRepository<StockData, Long> {

    // Custom query to find distinct brand types for a specific user where stock is available
    @Query("SELECT DISTINCT s.brandType FROM StockData s WHERE (s.totalItems > 0) AND s.userId = :userId")
    List<String> findAvailableBrandTypesByUserId(Long userId);

    // Custom query to find distinct brand name for a specific user and brand type where stock is available
    @Query("SELECT s.brandName FROM StockData s WHERE (s.totalItems > 0) AND s.userId = :userId AND s.brandType = :brandType")
    List<String> findAvailableBrandNamesByUserIdByBrandType(Long userId, String brandType);

    @Query("SELECT s.quantityId FROM StockData s WHERE (s.totalItems > 0) AND s.userId = :userId AND s.brandType = :brandType AND s.brandName = :brandName")
    List<Long> findAvailableBrandNamesByUserIdByBrandTypeByBrandName(Long userId, String brandType, String brandName);

    StockData findByUserIdAndBrandQuantityId(Long userId, Long brandQuantityId);

    StockData findByUserIdAndBrandTypeAndBrandNameAndQuantityId(Long userId, String brandType, String brandName, Long quantityId);

}
