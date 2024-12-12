package com.stockmanager.repository;

import com.stockmanager.model.StockSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockSaleRepository extends JpaRepository<StockSale, Long> {

    StockSale findStockSaleByUserIdAndBrandQuantityId(Long userId, Long brandQuantityId);
}
