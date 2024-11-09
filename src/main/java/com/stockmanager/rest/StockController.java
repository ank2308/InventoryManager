package com.stockmanager.rest;

import com.stockmanager.model.*;
import com.stockmanager.service.BrandDetailsService;
import com.stockmanager.service.StockDataService;
import com.stockmanager.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StockController {

    @Autowired
    private StockDataService stockDataService;

    @Autowired
    private BrandDetailsService brandDetailsService;

    @Autowired
    private UserDataService userDataService;

    @PostMapping("/stocks/add")
    public ResponseEntity<StockData> addStockData(@RequestBody StockData stockData) {
        StockData saveData = stockDataService.addStockData(stockData);
        return ResponseEntity.ok(saveData);
    }

    @GetMapping("/stocks/details")
    public ResponseEntity<List<CurrentStockDetails>> getStockDetails() {
        List<CurrentStockDetails> currentStockDetailsList = stockDataService.getAllStockData();
        return ResponseEntity.ok(currentStockDetailsList);
    }

    // API to fetch all unique brand names
    @GetMapping("/stocks/getBrandNameList")
    public ResponseEntity<List<String>> getAllBrandNames() {
        List<String> brandNameList = stockDataService.findDistinctBrandName();
        return ResponseEntity.ok(brandNameList);
    }

    @GetMapping("/stocks/brands/{brandName}")
    public StockDetails getBrandDetails(@PathVariable String brandName) {
        return stockDataService.getBrandDetails(brandName);
    }

    // API to save brand details
    @PostMapping("/stocks/brand/save")
    public ResponseEntity<BrandDetails> saveBrandDetails(@RequestBody BrandDetails brandDetails) {
        BrandDetails savedBrand = brandDetailsService.addBrandDetails(brandDetails);
        return ResponseEntity.ok(savedBrand);
    }

    // API to fetch all brand names
    @GetMapping("/stocks/brands")
    public List<BrandDetails> getAllBrands() {
        return brandDetailsService.getAllBrands();
    }

    // API to fetch all brand types (distinct)
    @GetMapping("/stocks/brands/types")
    public List<String> getAllBrandTypes() {
        return brandDetailsService.getAllBrandTypes();
    }

    // API to fetch all brands for a specific brand type
    @GetMapping("/stocks/brands/by-type/{brandType}")
    public List<BrandDetails> getBrandsByType(@PathVariable String brandType) {
        return brandDetailsService.getBrandsByType(brandType);
    }

    @PutMapping("/stocks/brands/edit/{id}")
    public ResponseEntity<?> editBrand(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newBrandName = body.get("brandName");
        brandDetailsService.updateBrandName(id, newBrandName);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    @DeleteMapping("/stocks/brands/delete/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandDetailsService.deleteBrand(id);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    @PostMapping("/users/add-user")
    public ResponseEntity<User> addStockData(@RequestBody User user) {
        User savedUserData = userDataService.addUserData(user);
        return ResponseEntity.ok(savedUserData);
    }
}
