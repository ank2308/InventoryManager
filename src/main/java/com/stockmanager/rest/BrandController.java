package com.stockmanager.rest;

import com.stockmanager.dto.BrandNameWithIdDTO;
import com.stockmanager.exception.DuplicateBrandNameException;
import com.stockmanager.model.*;
import com.stockmanager.service.BrandDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@RestControllerAdvice
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

    // API to save brand details
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add")
    public ResponseEntity<BrandDetails> addBrandWithQuantities(@RequestBody BrandDetailsWithQuantitiesRequestDTO request) {
        BrandDetails savedBrand = brandDetailsService.addBrandDetailsWithQuantity(request);
        return ResponseEntity.ok(savedBrand);
    }

    // API to fetch all brand names
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getAllBrands")
    public Page<BrandDetails> getAllBrands(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "5") int size) {
        return brandDetailsService.getAllBrands(page, size);
    }

    @GetMapping("/{brandId}")
    public ResponseEntity<BrandDetailsWithQuantitiesResponseDTO> getBrandDetailsWithQuantities(
            @PathVariable Long brandId) {
        BrandDetailsWithQuantitiesResponseDTO response = brandDetailsService.getBrandDetailsWithQuantities(brandId);
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/by-name/{brandName}")
    public ResponseEntity<BrandDetails> getBrandDetailsByName(@PathVariable String brandName) throws Exception {
        return ResponseEntity.ok(brandDetailsService.getBrandDetailsByName(brandName));
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
    public List<BrandNameWithIdDTO> getBrandsNamesByType(@PathVariable String brandType) {
        var response = brandDetailsService.getBrandNamesByType(brandType);
        return response;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editBrand(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newBrandName = body.get("brandName");
        brandDetailsService.updateBrandName(id, newBrandName);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandDetailsService.deleteBrand(id);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // API to fetch all brand types (distinct)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/types/{shopId}")
    public List<String> getAllBrandTypesByUserId(@PathVariable Long shopId ) {
        return brandDetailsService.getAllBrandTypesByShopId(shopId);
    }

    @GetMapping("search")
    public ResponseEntity<List<BrandDetails>> searchBrands(@RequestParam String brandName) {
        List<BrandDetails> brands = brandDetailsService.findByNameContaining(brandName);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getBrandSuggestions(@RequestParam String query) {
        List<String> suggestions = brandDetailsService.findBrandNamesContaining(query);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/types/{brandType}/{shopId}")
    public  List<String> getAllBrandNamesByShopIdByBrandType(@PathVariable Long shopId, @PathVariable String brandType ) {
        return brandDetailsService.getAllBrandNamesByShopIdByBrandType(shopId, brandType);
    }

    @ExceptionHandler(DuplicateBrandNameException.class)
    public ResponseEntity<String> handleDuplicateBrandNameException(DuplicateBrandNameException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }


}
