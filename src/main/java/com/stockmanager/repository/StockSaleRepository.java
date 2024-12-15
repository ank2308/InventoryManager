package com.stockmanager.repository;

import com.stockmanager.model.StockSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockSaleRepository extends JpaRepository<StockSale, Long> {

    StockSale findStockSaleByShopIdAndBrandQuantityId(Long shopId, Long brandQuantityId);
    StockSale findStockSaleByShopIdAndBrandNameAndBrandType(Long shopId, String brandName, String brandType);
    @Query("SELECT DISTINCT s FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.shopId = :shopId")
    List<StockSale> findAllByShopIdAndTotalItemsGreaterThanZero(Long shopId);
    @Query("SELECT DISTINCT s.brandName FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.shopId = :shopId AND s.brandType = :brandType")
    List<String> findAllBrandNamesByShopIdAndBrandTypeAndTotalItemsGreaterThanZero(Long shopId, String brandType);
    @Query("SELECT DISTINCT s.brandQuantityId FROM StockSale s WHERE (s.totalItemsLeft > 0) AND s.shopId = :shopId AND s.brandType = :brandType AND s.brandName = :brandName")
    List<Long> findAllBrandQuantityIdByShopIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(Long shopId, String brandType, String brandName);
    @Query("SELECT s FROM StockSale s WHERE s.shopId = :shopId")
    List<StockSale> findAllShopId(Long shopId);
}
