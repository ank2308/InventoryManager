package com.stockmanager.service;

import com.stockmanager.dto.StockRequestDTO;
import com.stockmanager.model.*;
import com.stockmanager.repository.QuantityRepository;
import com.stockmanager.repository.StockDataRepository;
import com.stockmanager.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockDataService {

    @Autowired
    private StockDataRepository stockDataRepository;
    @Autowired
    private QuantityRepository quantityRepository;
    @Autowired
    private DateUtil dateUtil;

    public StockData addStockData(StockData newStockData) {
        int quantity = quantityRepository.findById(newStockData.getQuantityId()).get().getQuantity();
        var totalItems = (newStockData.getItemsInCrate() * newStockData.getCrateInLot());
        var totalQuantity = totalItems * quantity;
        newStockData.setTotalItems(totalItems);
        newStockData.setTotalLiquorQuantity(totalQuantity);
        newStockData.setDateEntered(dateUtil.parseDate(newStockData.getDateEntered()));
        //To-Do
        newStockData.setMarginPrice(0);
        return stockDataRepository.save(newStockData);
    }

    public List<CurrentStockDetails> getAllStockData(StockRequestDTO stockRequestDTO) {
        List<CurrentStockDetails> currentStockDetailsList = new ArrayList<>();

        DateRangeType dateRangeType = stockRequestDTO.getSelectedDateRange();

        List<StockData> stockDataList = new ArrayList<>();
        switch (dateRangeType) {
            case DAY:
                stockDataList = getStockForToday(stockRequestDTO.getUserId());
                break;
            case WEEK:
                stockDataList = getStockForLastWeek(stockRequestDTO.getUserId());
                break;
            case MONTH:
                stockDataList = getStockForLastMonth(stockRequestDTO.getUserId());
                break;
            case CUSTOM:
                stockDataList = getStockForDateRange(stockRequestDTO.getUserId(), stockRequestDTO.getStartDate(), stockRequestDTO.getEndDate());
                break;
        }

        if(!stockDataList.isEmpty()) {
            for (StockData stockData : stockDataList) {
                CurrentStockDetails currentStockDetails = new CurrentStockDetails();
                currentStockDetails.setBrandType(stockData.getBrandType());
                currentStockDetails.setBrandName(stockData.getBrandName());
                //GetLiquorQuantity
                var liquorQuantity = quantityRepository.findById(stockData.getQuantityId()).get();
                currentStockDetails.setLiquorQuantity(liquorQuantity.getQuantityName() + " - " + liquorQuantity.getQuantity());
                currentStockDetails.setTotalItemsLeft(stockData.getTotalItems());
                currentStockDetails.setTotalLiquorQuantityLeft(stockData.getTotalLiquorQuantity());
                currentStockDetails.setTotalPrice(stockData.getMrp() * stockData.getTotalItems());
                currentStockDetails.setWarehouseNumber(stockData.getWarehouseNumber());
                currentStockDetailsList.add(currentStockDetails);
            }
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

        // Get sales for today
        private List<StockData> getStockForToday(Long userId) {
            Date today = dateUtil.parseDate(new Date());
            var todaySale = stockDataRepository.findByUserIdAndDateEntered(userId, today);
            return todaySale;
        }

        // Get sales for the last week
        private List<StockData> getStockForLastWeek(Long userId) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_YEAR, -7);
            Date lastWeekStart = dateUtil.parseDate(calendar.getTime());


            // Fetch sales from last week's start date to today
            return stockDataRepository.findStockDataInDateRange(userId, lastWeekStart, dateUtil.parseDate(new Date()));
        }

        // Get sales for the last month
        private List<StockData> getStockForLastMonth(Long userId) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MONTH, -1);
            Date lastMonthStart = dateUtil.parseDate(calendar.getTime());

            // Fetch sales from last month's start date to today
            return stockDataRepository.findStockDataInDateRange(userId, lastMonthStart, dateUtil.parseDate(new Date()));
        }

        // Get sales for a custom date range
        private List<StockData> getStockForDateRange(Long userId, Date startDate, Date endDate) {
            // Fetch sales for the custom date range provided
            return stockDataRepository.findStockDataInDateRange(userId, dateUtil.parseDate(startDate), dateUtil.parseDate(endDate));
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

    public boolean updateStockData(StockData currentStock) {
        StockData stockData = stockDataRepository.findByUserIdAndBrandTypeAndBrandNameAndQuantityId(
                currentStock.getUserId(),
                currentStock.getBrandType(),
                currentStock.getBrandName(),
                currentStock.getQuantityId());
        if (stockData != null) {
            if(stockData.getTotalItems() >= currentStock.getTotalItems()) {
                int updatedTotalItems = stockData.getTotalItems() - currentStock.getTotalItems();
                stockData.setTotalItems(updatedTotalItems);
                stockDataRepository.save(stockData);
            } else {
                return false;
            }
        }
        return true;
    }

}
