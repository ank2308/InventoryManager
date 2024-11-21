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

    // Find all records for a specific brand name
    List<StockData> findByBrandName(String brandName);

    // Custom method to find StockData by userId, brandName, and liquorQuantityInCrate
    List<StockData> findByUserIdAndBrandNameAndLiquorQuantityInCrate(Long userId, String brandName, int liquorQuantityInCrate);

    // Custom query to find distinct brand types for a specific user where stock is available
    @Query("SELECT DISTINCT s.brandType FROM StockData s WHERE (s.totalQuantity > 0 OR s.crateQuantity > 0) AND s.userId = :userId")
    List<String> findAvailableBrandTypesByUserId(Long userId);

    // Custom query to find distinct brand name for a specific user and brand type where stock is available
    @Query("SELECT s.brandName, s.liquorQuantityInCrate FROM StockData s WHERE (s.totalQuantity > 0 OR s.crateQuantity > 0) AND s.userId = :userId AND s.brandType = :brandType")
    List<Object[]> findAvailableBrandNamesByUserIdByBrandType(Long userId, String brandType);

}
