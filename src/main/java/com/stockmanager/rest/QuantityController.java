package com.stockmanager.rest;

import com.stockmanager.model.Quantity;
import com.stockmanager.service.BrandDetailsService;
import com.stockmanager.service.QuantityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quantities")
public class QuantityController {

    @Autowired
    private QuantityService quantityService;

    @Autowired
    private BrandDetailsService brandDetailsService;

    // get all quantities type stored in table
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/")
    public List<Quantity> getQuantities() {
        return quantityService.getAllQuantities();
    }


    // Fetch all brand quantities based on brand name
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{brandName}")
    public List<Quantity> getQuantitiesByBrandName(@PathVariable String brandName) {
        return brandDetailsService.getQuantitiesForBrand(brandName);
    }

    @GetMapping("/getQuantityById/{quantityId}")
    public Quantity getQuantityById(@PathVariable int quantityId) {
        return quantityService.getQuantityById((long) quantityId);
    }

}
