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
@RequestMapping("/api/brand")
public class BrandController {

    @Autowired
    private BrandDetailsService brandDetailsService;


    // API to save brand details
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/save")
    public ResponseEntity<BrandDetails> saveBrandDetails(@RequestBody BrandDetails brandDetails) {
        BrandDetails savedBrand = brandDetailsService.addBrandDetails(brandDetails);
        return ResponseEntity.ok(savedBrand);
    }

    // API to fetch all brand names
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/")
    public List<BrandDetails> getAllBrands() {
        return brandDetailsService.getAllBrands();
    }

    // API to fetch all brand types (distinct)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/types")
    public List<String> getAllBrandTypes() {
        return brandDetailsService.getAllBrandTypes();
    }


    // API to fetch all brands for a specific brand type
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/by-type/{brandType}")
    public List<String> getBrandsByType(@PathVariable String brandType) {
        return brandDetailsService.getBrandNamesByType(brandType);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editBrand(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newBrandName = body.get("brandName");
        brandDetailsService.updateBrandName(id, newBrandName);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandDetailsService.deleteBrand(id);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
}
