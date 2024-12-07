package com.stockmanager.service;

import com.stockmanager.model.*;
import com.stockmanager.repository.QuantityRepository;
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
    @Autowired
    private QuantityRepository quantityRepository;

    public StockData addStockData(StockData newStockData) {
        StockData stockData = stockDataRepository.findByUserIdAndBrandQuantityId(newStockData.getUserId(), newStockData.getBrandQuantityId());
        int quantity = quantityRepository.findById(newStockData.getQuantityId()).get().getQuantity();
        if(stockData != null) {
            var totalItems = (newStockData.getItemsInCrate() * newStockData.getCrateInLot() * newStockData.getLotSize());
            var updatedTotalQuantity = (totalItems * quantity) + stockData.getTotalLiquorQuantity();
            stockData.setCrateInLot(stockData.getCrateInLot() + newStockData.getCrateInLot());
            stockData.setLotSize(stockData.getLotSize() + newStockData.getLotSize());
            stockData.setTotalLiquorQuantity(updatedTotalQuantity);
            stockData.setTotalItems(stockData.getTotalItems() + totalItems);
        } else {
            var totalItems = (newStockData.getItemsInCrate() * newStockData.getCrateInLot() * newStockData.getLotSize());
            var totalQuantity = totalItems * quantity;
            newStockData.setTotalItems(totalItems);
            newStockData.setTotalLiquorQuantity(totalQuantity);
            return stockDataRepository.save(newStockData);
        }
        return stockDataRepository.save(stockData);
    }

    public List<CurrentStockDetails> getAllStockData() {
        List<CurrentStockDetails> currentStockDetailsList = new ArrayList<>();
        List<StockData> stockDataList = stockDataRepository.findAll();
        for(StockData stockData : stockDataList) {
            CurrentStockDetails currentStockDetails = new CurrentStockDetails();
            currentStockDetails.setBrandType(stockData.getBrandType());
            currentStockDetails.setBrandName(stockData.getBrandName());
            //GetLiquorQuantity
            var liquorQuantity = quantityRepository.findById(stockData.getQuantityId()).get();


            currentStockDetails.setLiquorQuantity(liquorQuantity.getQuantityName() + " - " + liquorQuantity.getQuantity());
            currentStockDetails.setTotalItemsLeft(stockData.getTotalItems());
            currentStockDetails.setTotalLiquorQuantityLeft(stockData.getTotalLiquorQuantity());
            currentStockDetails.setTotalPrice(stockData.getMrp() * stockData.getTotalItems());
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

//    public StockDetails getBrandDetails(String brandName) {
//        List<StockData> stockDataList = stockDataRepository.findByBrandName(brandName);
//        int totalItems = 0;
//        int totalLiquorQuantity = 0;
//        double totalPrice = 0;
//        for(StockData stockData : stockDataList) {
//            totalItems = totalItems + stockData.getCrateLotSize();
//            totalLiquorQuantity = totalLiquorQuantity + (stockData.getCrateLotSize() * stockData.getCrateQuantity());
//        }
//        totalPrice = (stockDataList.get(0).getMrp() * totalLiquorQuantity * totalCrateSize);
//        StockDetails stockDetails = new StockDetails();
//        stockDetails.setBrandName(stockDataList.get(0).getBrandName());
////        stockDetails.setBrandType(stockDataList.get(0).getBrandType());
//        stockDetails.setTotalCrateLotQuantity(totalCrateSize);
//        stockDetails.setTotalLiquorQuantity(totalLiquorQuantity);
//        stockDetails.setTotalPrice(totalPrice);
//        return stockDetails;
//    }

    // Method to get available liquor quantities (enum) based on stock
//    public List<LiquorQuantity> getAvailableLiquorQuantities() {
//        List<StockData> stockDataList = stockDataRepository.findAll();
//        List<LiquorQuantity> availableQuantities = new ArrayList<>();
//
//        // Loop through all stock data and check if crateQuantity > 0
//        for (StockData stock : stockDataList) {
//            if (stock.getTotalItems() > 0) {
//                // Try to map liquorQuantityInCrate to LiquorQuantity enum
//                try {
//                    LiquorQuantity quantity = LiquorQuantity.fromInt(stock.getLiquorQuantityInCrate());
//                    availableQuantities.add(quantity);
//                } catch (IllegalArgumentException e) {
//                    // If no matching LiquorQuantity enum is found, skip it
//                    System.out.println("Invalid liquor quantity: " + stock.getLiquorQuantityInCrate() + " ml");
//                }
//            }
//        }
//
//        return availableQuantities;
//    }

//    public boolean updateStockData(StockData stockData) {
//        List<StockData> currentStocks = stockDataRepository.findByUserIdAndBrandNameAndLiquorQuantityInCrate(
//                stockData.getUserId(),
//                stockData.getBrandName(),
//                stockData.getLiquorQuantityInCrate());
//        if (currentStocks.size()> 0) {
//            StockData currentStock = currentStocks.get(0);
////            int currentQuantityLeftInStock = currentStock.getCrateLotSize() * currentStock.getCrateQuantity();
//            if(stockData.getTotalQuantity() > currentStock.getCrateLotSize()) {
//                int numOfCrate = stockData.getTotalQuantity()/currentStock.getCrateLotSize();
////                int quantityLeft = stockData.getTotalQuantity() - currentStock.getCrateLotSize() * numOfCrate;
//                currentStock.setCrateQuantity(currentStock.getCrateQuantity() - numOfCrate);
//                currentStock.setTotalQuantity(currentStock.getTotalQuantity() - stockData.getTotalQuantity());
//                stockDataRepository.save(currentStock);
//            } else if(stockData.getTotalQuantity() < currentStock.getCrateLotSize()) {
//                currentStock.setTotalQuantity(currentStock.getTotalQuantity() - stockData.getTotalQuantity());
//                stockDataRepository.save(currentStock);
//            } else {
//                return false;
//            }
//        }
//        return true;
//    }

}
