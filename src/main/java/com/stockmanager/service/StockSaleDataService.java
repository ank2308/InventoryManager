package com.stockmanager.service;

import com.stockmanager.model.CurrentStockDetails;
import com.stockmanager.model.StockSale;
import com.stockmanager.model.BrandDetailsWithQuantitiesResponseDTO.QuantityNameWithMrpDTO;
import com.stockmanager.repository.BrandQuantityMappingRepository;
import com.stockmanager.repository.StockSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StockSaleDataService {

    @Autowired
    StockSaleRepository stockSaleRepository;

    @Autowired
    BrandQuantityMappingRepository brandQuantityMappingRepository;

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

    public StockSale getStockSaleByUserIdAndBrandNameAndBrandType(Long userId, String brandName, String brandType) {
        return stockSaleRepository.findStockSaleByUserIdAndBrandNameAndBrandType(userId, brandName, brandType);
    }

    public List<StockSale> findAllByUserIdAndTotalItemsGreaterThanZero(Long userId) {
        return stockSaleRepository.findAllByUserIdAndTotalItemsGreaterThanZero(userId);
    }

    public List<String> findAllByUserIdAndBrandTypeAndTotalItemsLessThanZero(Long userId, String brandType) {
        return stockSaleRepository.findAllBrandNamesByUserIdAndBrandTypeAndTotalItemsGreaterThanZero(userId, brandType);
    }

    public List<Long> findAllBrandQuantityByUserIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(Long userId, String brandType, String brandName) {
        return stockSaleRepository.findAllBrandQuantityIdByUserIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(userId, brandType, brandName);

    }

    public List<CurrentStockDetails> findAvailabStock(Long userId) {
        List<StockSale> stockSales =  stockSaleRepository.findAllUserId(userId);
        List<CurrentStockDetails> currentStockDetails = new ArrayList<>();
        for (StockSale stockSale : stockSales) {
            QuantityNameWithMrpDTO obj = (QuantityNameWithMrpDTO) brandQuantityMappingRepository
                                    .findBrandQuantityByMapping(stockSale.getBrandQuantityId());
                                    
            CurrentStockDetails curStock = new CurrentStockDetails();
            curStock.setBrandName(stockSale.getBrandName());
            curStock.setBrandType(stockSale.getBrandType());
            curStock.setTotalItemsLeft(stockSale.getTotalItemsLeft());
            curStock.setLiquorQuantity(obj.getQuantityName());
            curStock.setLiquorSize(obj.getQuantity());
            curStock.setMrp(obj.getMrp());
            
            currentStockDetails.add(curStock);
        }
        return currentStockDetails;
    }
}
