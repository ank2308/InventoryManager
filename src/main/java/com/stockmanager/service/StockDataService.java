package com.stockmanager.service;

import com.stockmanager.model.StockData;
import com.stockmanager.model.StockDetails;
import com.stockmanager.repository.StockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockDataService {

    @Autowired
    private StockDataRepository stockDataRepository;

    public StockData addStockData(StockData stockData) {
        return stockDataRepository.save(stockData);
    }

    public List<String> findDistinctBrandName() {
        return stockDataRepository.findAll()
                .stream()
                .map(StockData::getBrandName)
                .distinct()
                .collect(Collectors.toList());
    }

    public StockDetails getBrandDetails(String brandName) {
        List<StockData> stockDataList = stockDataRepository.findByBrandName(brandName);
        int totalCrateSize = 0;
        int totalLiquorQuantity = 0;
        double totalPrice = 0;
        for(StockData stockData : stockDataList) {
            totalCrateSize = totalCrateSize + stockData.getCrateLotSize();
            totalLiquorQuantity = totalLiquorQuantity + (stockData.getCrateLotSize() * stockData.getCrateQuantity());
        }
        totalPrice = (stockDataList.get(0).getMrp() * totalLiquorQuantity * totalCrateSize);
        StockDetails stockDetails = new StockDetails();
        stockDetails.setBrandName(stockDataList.get(0).getBrandName());
        stockDetails.setBrandType(stockDataList.get(0).getBrandType());
        stockDetails.setTotalCrateLotQuantity(totalCrateSize);
        stockDetails.setTotalLiquorQuantity(totalLiquorQuantity);
        stockDetails.setTotalPrice(totalPrice);
        return stockDetails;
    }



}
