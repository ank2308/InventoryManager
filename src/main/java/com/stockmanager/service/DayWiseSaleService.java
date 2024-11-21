package com.stockmanager.service;

import com.stockmanager.model.DayWiseSale;
import com.stockmanager.model.DayWiseSaleDTO;
import com.stockmanager.model.LiquorQuantity;
import com.stockmanager.model.StockData;
import com.stockmanager.repository.DayWiseSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        dayWiseSale.setLiquorQuantity(LiquorQuantity.fromString(dto.getLiquorQuantity()));
        dayWiseSale.setQuantity(dto.getQuantity());
        dayWiseSale.setMrp(dto.getMrp());
        dayWiseSale.setDateOfSale(dto.getDateOfSale());

        // update stock quantity
        StockData updateStockData = new StockData();
        updateStockData.setUserId(dayWiseSale.getUserId());
        updateStockData.setLiquorQuantityInCrate(dayWiseSale.getLiquorQuantity());
        updateStockData.setTotalQuantity(dayWiseSale.getQuantity());
        updateStockData.setBrandName(dayWiseSale.getBrandName());
        updateStockData.setBrandType(dayWiseSale.getBrandType());
        boolean status = stockDataService.updateStockData(updateStockData);
        if (!status) {
            throw new Exception("error while updating exception");
        }

        DayWiseSale res = dayWiseSaleRepository.save(dayWiseSale);


        return res.getId();
    }
}
