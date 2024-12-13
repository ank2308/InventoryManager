package com.stockmanager.repository;

import com.stockmanager.model.StockSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockSaleRepository extends JpaRepository<StockSale, Long> {

    StockSale findStockSaleByUserIdAndBrandQuantityId(Long userId, Long brandQuantityId);
    StockSale findStockSaleByUserIdAndBrandNameAndBrandType(Long userId, String brandName, String brandType);
    @Query("SELECT s FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.userId = :userId")
    List<StockSale> findAllByUserIdAndTotalItemsGreaterThanZero(Long userId);
    @Query("SELECT s.brandName FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.userId = :userId AND s.brandType = :brandType")
    List<String> findAllBrandNamesByUserIdAndBrandTypeAndTotalItemsGreaterThanZero(Long userId, String brandType);
    @Query("SELECT s.brandQuantityId FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.userId = :userId AND s.brandType = :brandType AND s.brandName = :brandName")
    List<Long> findAllBrandQuantityIdByUserIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(Long userId, String brandType, String brandName);
}
