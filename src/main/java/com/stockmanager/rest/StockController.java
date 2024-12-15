package com.stockmanager.rest;

import com.stockmanager.dto.BrandStockUserDTO;
import com.stockmanager.dto.SaleQuantityDTO;
import com.stockmanager.dto.SalesRequestDTO;
import com.stockmanager.dto.StockRequestDTO;
import com.stockmanager.model.*;
import com.stockmanager.service.BrandDetailsService;
import com.stockmanager.service.DayWiseSaleService;
import com.stockmanager.service.StockDataService;
import com.stockmanager.service.StockSaleDataService;
import com.stockmanager.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockDataService stockDataService;

    @Autowired
    private StockSaleDataService saleDataService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add")
    public ResponseEntity<StockData> addStockData(@RequestBody StockData stockData) {
        StockData saveData = stockDataService.addStockData(stockData);
        return ResponseEntity.ok(saveData);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/details")
    public List<CurrentStockDetails> getStockDetails(@RequestBody StockRequestDTO stockRequestDTO) {
        List<CurrentStockDetails> currentStockDetailsList = stockDataService.getAllStockData(stockRequestDTO);
        return currentStockDetailsList;
    }

    // API to fetch all unique brand names
    @GetMapping("/getBrandNameList")
    public ResponseEntity<List<String>> getAllBrandNames() {
        List<String> brandNameList = stockDataService.findDistinctBrandName();
        return ResponseEntity.ok(brandNameList);
    }

    // API to fetch all quantites (distinct)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/types/{brandType}/{shopId}/{brandName}")
    public  List<SaleQuantityDTO> getAllQuantitiesByUserIdByBrandTypeByBrandName(@PathVariable String brandType, @PathVariable Long shopId, @PathVariable String brandName) {
        return stockDataService.getAllQuantitiesByShopIdByBrandTypeByBrandName(shopId, brandType, brandName);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/available-stocks/{shopId}")
    public List<CurrentStockDetails> getAvailableStockDetails(@PathVariable Long shopId) {
        List<CurrentStockDetails> currenStockDetails = saleDataService.findAvailabStock(shopId);
        return currenStockDetails;
    }


//    @GetMapping("/available-liquor-quantities")
//    public List<LiquorQuantity> getAvailableLiquorQuantities() {
//        // need to add brand name and user id as parameter
//        return stockDataService.getAvailableLiquorQuantities();
//    }
}
