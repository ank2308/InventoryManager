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
    @Query("SELECT s FROM StockData s WHERE (s.totalItems > 0) AND s.userId = :userId AND s.brandType = :brandType AND s.brandName = :brandName")
    List<StockData> findAvailableBrandNamesByUserIdByBrandTypeByBrandName(Long userId, String brandType, String brandName);

    StockData findByUserIdAndBrandQuantityId(Long userId, Long brandQuantityId);

    StockData findByUserIdAndBrandTypeAndBrandNameAndQuantityId(Long userId, String brandType, String brandName, Long quantityId);

    List<StockData> findAllByUserId(Long userId);
    List<StockData> findByUserIdAndDateEntered(Long userId, Date dateEntered);

    @Query("SELECT d FROM StockData d WHERE d.userId = :userId AND d.dateEntered BETWEEN :startDate AND :endDate")
    List<StockData> findStockDataInDateRange(Long userId, Date startDate, Date endDate);

}
