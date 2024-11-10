package com.stockmanager.service;

import com.stockmanager.model.*;
import com.stockmanager.repository.StockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockDataService {

    @Autowired
    private StockDataRepository stockDataRepository;

    public StockData addStockData(StockData stockData) {
        return stockDataRepository.save(stockData);
    }

    public List<CurrentStockDetails> getAllStockData() {
        List<CurrentStockDetails> currentStockDetailsList = new ArrayList<>();
        List<StockData> stockDataList = stockDataRepository.findAll();
        for(StockData stockData : stockDataList) {
            CurrentStockDetails currentStockDetails = new CurrentStockDetails();
            currentStockDetails.setBrandType(BrandType.fromString(stockData.getBrandType()));
            currentStockDetails.setBrandName(stockData.getBrandName());
            currentStockDetails.setLiquorQuantity(LiquorQuantity.fromInt(stockData.getLiquorQuantityInCrate()));
            currentStockDetails.setTotalCrateLotQuantityLeft(stockData.getCrateLotSize() * stockData.getCrateQuantity());
            currentStockDetails.setTotalLiquorQuantityLeft(stockData.getLiquorQuantityInCrate() * currentStockDetails.getTotalCrateLotQuantityLeft());
            currentStockDetails.setTotalPrice(stockData.getMrp() *currentStockDetails.getLiquorQuantity().getQuantityInMl());
            currentStockDetailsList.add(currentStockDetails);
        }
        return currentStockDetailsList;
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
//        stockDetails.setBrandType(stockDataList.get(0).getBrandType());
        stockDetails.setTotalCrateLotQuantity(totalCrateSize);
        stockDetails.setTotalLiquorQuantity(totalLiquorQuantity);
        stockDetails.setTotalPrice(totalPrice);
        return stockDetails;
    }

    // Method to get available liquor quantities (enum) based on stock
    public List<LiquorQuantity> getAvailableLiquorQuantities() {
        List<StockData> stockDataList = stockDataRepository.findAll();
        List<LiquorQuantity> availableQuantities = new ArrayList<>();

        // Loop through all stock data and check if crateQuantity > 0
        for (StockData stock : stockDataList) {
            if (stock.getCrateQuantity() > 0) {
                // Try to map liquorQuantityInCrate to LiquorQuantity enum
                try {
                    LiquorQuantity quantity = LiquorQuantity.fromInt(stock.getLiquorQuantityInCrate());
                    availableQuantities.add(quantity);
                } catch (IllegalArgumentException e) {
                    // If no matching LiquorQuantity enum is found, skip it
                    System.out.println("Invalid liquor quantity: " + stock.getLiquorQuantityInCrate() + " ml");
                }
            }
        }

        return availableQuantities;
    }

}
