package com.stockmanager.rest;

import com.stockmanager.model.*;
import com.stockmanager.service.BrandDetailsService;
import com.stockmanager.service.DayWiseSaleService;
import com.stockmanager.service.StockDataService;
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
    private BrandDetailsService brandDetailsService;

    @Autowired
    private UserDataService userDataService;
    @Autowired
    private DayWiseSaleService dayWiseSaleService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add")
    public ResponseEntity<StockData> addStockData(@RequestBody StockData stockData) {
        StockData saveData = stockDataService.addStockData(stockData);
        return ResponseEntity.ok(saveData);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/details")
    public ResponseEntity<List<CurrentStockDetails>> getStockDetails() {
        List<CurrentStockDetails> currentStockDetailsList = stockDataService.getAllStockData();
        return ResponseEntity.ok(currentStockDetailsList);
    }

    // API to fetch all unique brand names
    @GetMapping("/getBrandNameList")
    public ResponseEntity<List<String>> getAllBrandNames() {
        List<String> brandNameList = stockDataService.findDistinctBrandName();
        return ResponseEntity.ok(brandNameList);
    }

    @GetMapping("/{brandName}")
    public StockDetails getBrandDetails(@PathVariable String brandName) {
        return stockDataService.getBrandDetails(brandName);
    }

    // API to fetch all brand types (distinct)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/brands/types/{userId}")
    public List<String> getAllBrandTypesByUserId(@PathVariable Long userId ) {
        return brandDetailsService.getAllBrandTypesByUserId(userId);
    }

    // API to fetch all brand types (distinct)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/brands/types/{brandType}/{userId}")
    public  Map<String, List<String>> getAllBrandNamesByUserIdByBrandType(@PathVariable Long userId, @PathVariable String brandType ) {
        return brandDetailsService.getAllBrandNamesByUserIdByBrandType(userId, brandType);
    }


    @GetMapping("/available-liquor-quantities")
    public List<LiquorQuantity> getAvailableLiquorQuantities() {
        // need to add brand name and user id as parameter
        return stockDataService.getAvailableLiquorQuantities();
    }




}
