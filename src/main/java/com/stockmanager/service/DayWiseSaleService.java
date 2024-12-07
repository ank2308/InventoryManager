package com.stockmanager.service;

import com.stockmanager.dto.DayWiseSaleDTO;
import com.stockmanager.dto.SalesRequestDTO;
import com.stockmanager.model.*;
import com.stockmanager.repository.DayWiseSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class DayWiseSaleService {

    @Autowired
    private DayWiseSaleRepository dayWiseSaleRepository;

    @Autowired
    private StockDataService stockDataService;

    public Long addDayWiseSale(DayWiseSaleDTO dto) throws Exception {
        DayWiseSale dayWiseSale = new DayWiseSale();
        dayWiseSale.setUserId(dto.getUserId());
        dayWiseSale.setBrandName(dto.getBrandName());
        dayWiseSale.setBrandType(dto.getBrandType());
        dayWiseSale.setItemsSold(dto.getQuantity());
        dayWiseSale.setMrp(dto.getMrp());
        dayWiseSale.setDateOfSale(dto.getDateOfSale());

//        // update stock quantity
//        StockData updateStockData = new StockData();
//        updateStockData.setUserId(dayWiseSale.getUserId());
//        updateStockData.setLiquorQuantityInCrate(dayWiseSale.getLiquorQuantity());
//        updateStockData.setTotalQuantity(dayWiseSale.getItemsSold());
//        updateStockData.setBrandName(dayWiseSale.getBrandName());
//        updateStockData.setBrandType(dayWiseSale.getBrandType());
//        boolean status = stockDataService.updateStockData(updateStockData);
//        if (!status) {
//            throw new Exception("error while updating exception");
//        }

        DayWiseSale res = dayWiseSaleRepository.save(dayWiseSale);


        return res.getId();
    }


    public List<DayWiseSale> getSales(SalesRequestDTO requestDTO) {
        DateRangeType dateRangeType = requestDTO.getSelectedDateRange();

        switch (dateRangeType) {
            case DAY:
                return getSalesForToday(requestDTO.getUserId());
            case WEEK:
                return getSalesForLastWeek(requestDTO.getUserId());
            case MONTH:
                return getSalesForLastMonth(requestDTO.getUserId());
            case CUSTOM:
                return getSalesForDateRange(requestDTO.getUserId(), requestDTO.getStartDate(), requestDTO.getEndDate());
            default:
                throw new IllegalArgumentException("Invalid date range");
        }
    }

    // Get sales for today
    private List<DayWiseSale> getSalesForToday(Long userId) {
        Date today = new Date();
        return dayWiseSaleRepository.findByUserIdAndDateOfSale(userId, today);
    }

    // Get sales for the last week
    private List<DayWiseSale> getSalesForLastWeek(Long userId) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        Date lastWeekStart = calendar.getTime();

        // Fetch sales from last week's start date to today
        return dayWiseSaleRepository.findSalesInDateRange(userId, lastWeekStart, new Date());
    }

    // Get sales for the last month
    private List<DayWiseSale> getSalesForLastMonth(Long userId) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        Date lastMonthStart = calendar.getTime();

        // Fetch sales from last month's start date to today
        return dayWiseSaleRepository.findSalesInDateRange(userId, lastMonthStart, new Date());
    }

    // Get sales for a custom date range
    private List<DayWiseSale> getSalesForDateRange(Long userId, Date startDate, Date endDate) {
        // Fetch sales for the custom date range provided
        return dayWiseSaleRepository.findSalesInDateRange(userId, startDate, endDate);
    }

    private int TotalQuantityUser(Long userId) {
        List<DayWiseSale> dayWiseSales = dayWiseSaleRepository.findByUserId(userId);
        var totalQuantity = 0;
        //Get Total Quantity from dayWiseSales
        for(DayWiseSale dayWiseSale : dayWiseSales) {
            totalQuantity = totalQuantity + dayWiseSale.getItemsSold();
        }
        return totalQuantity;
    }
}
