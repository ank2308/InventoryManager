package com.stockmanager.service;

import com.stockmanager.model.StockSale;
import com.stockmanager.repository.StockSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockSaleDataService {

    @Autowired
    StockSaleRepository stockSaleRepository;

    public StockSale getStockSaleByUserIdAndBrandQuantityId(Long userId, Long brandQuantityId) {
        return stockSaleRepository.findStockSaleByUserIdAndBrandQuantityId(userId, brandQuantityId);
    }

    public boolean saveStockSale(StockSale stockSale){
        stockSaleRepository.save(stockSale);
        return true;
    }

    public boolean updateStockSale(StockSale stockSale){
        stockSaleRepository.save(stockSale);
        return true;
    }
}
