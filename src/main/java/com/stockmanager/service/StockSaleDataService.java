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

    public StockSale getStockSaleByShopIdAndBrandQuantityId(Long userId, Long brandQuantityId) {
        return stockSaleRepository.findStockSaleByShopIdAndBrandQuantityId(userId, brandQuantityId);
    }

    public boolean saveStockSale(StockSale stockSale){
        stockSaleRepository.save(stockSale);
        return true;
    }

    public boolean updateStockSale(StockSale stockSale){
        stockSaleRepository.save(stockSale);
        return true;
    }

    public StockSale getStockSaleByShopIdAndBrandNameAndBrandType(Long shopId, String brandName, String brandType) {
        return stockSaleRepository.findStockSaleByShopIdAndBrandNameAndBrandType(shopId, brandName, brandType);
    }

    public List<StockSale> findAllByShopIdAndTotalItemsGreaterThanZero(Long shopId) {
        return stockSaleRepository.findAllByShopIdAndTotalItemsGreaterThanZero(shopId);
    }

    public List<String> findAllByShopIdAndBrandTypeAndTotalItemsLessThanZero(Long shopId, String brandType) {
        return stockSaleRepository.findAllBrandNamesByShopIdAndBrandTypeAndTotalItemsGreaterThanZero(shopId, brandType);
    }

    public List<Long> findAllBrandQuantityByShopIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(Long shopId, String brandType, String brandName) {
        return stockSaleRepository.findAllBrandQuantityIdByShopIdAndBrandTypeAndBrandNameAndTotalItemsGreaterThanZero(shopId, brandType, brandName);

    }

    public List<CurrentStockDetails> findAvailabStock(Long shopId) {
        List<StockSale> stockSales =  stockSaleRepository.findAllShopId(shopId);
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
