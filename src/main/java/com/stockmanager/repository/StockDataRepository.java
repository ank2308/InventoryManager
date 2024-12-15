package com.stockmanager.repository;

import com.stockmanager.model.BrandType;
import com.stockmanager.model.DayWiseSale;
import com.stockmanager.model.LiquorQuantity;
import com.stockmanager.model.StockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StockDataRepository extends JpaRepository<StockData, Long> {
    @Query("SELECT s FROM StockData s WHERE (s.totalItems > 0) AND s.shopId = :shopId AND s.brandType = :brandType AND s.brandName = :brandName")
    List<StockData> findAvailableBrandNamesByShopIdIdByBrandTypeByBrandName(Long shopId, String brandType, String brandName);

    // StockData findByShopIdIdAndBrandQuantityId(Long shopId, Long brandQuantityId);

    StockData findByShopIdAndBrandTypeAndBrandNameAndQuantityId(Long shopId, String brandType, String brandName, Long quantityId);

    List<StockData> findAllByShopId(Long shopId);
    List<StockData> findByShopIdAndDateEntered(Long shopId, Date dateEntered);

    @Query("SELECT d FROM StockData d WHERE d.shopId = :shopId AND d.dateEntered BETWEEN :startDate AND :endDate")
    List<StockData> findStockDataInDateRange(Long shopId, Date startDate, Date endDate);

}
