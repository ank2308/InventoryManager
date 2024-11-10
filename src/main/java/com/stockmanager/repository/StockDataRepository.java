package com.stockmanager.repository;

import com.stockmanager.model.LiquorQuantity;
import com.stockmanager.model.StockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockDataRepository extends JpaRepository<StockData, Long> {

    // Find all records for a specific brand name
    List<StockData> findByBrandName(String brandName);
}
