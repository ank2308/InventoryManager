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
@RequestMapping("/api/sale")
public class SaleController {

    @Autowired
    private DayWiseSaleService dayWiseSaleService;

    // Api to save day wise sale
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/day-wise")
    public ResponseEntity<Long> addDayWiseSale(@RequestBody DayWiseSaleDTO dayWiseSaleDTO) throws Exception {
        System.out.println(dayWiseSaleDTO);
        Long savedId = dayWiseSaleService.addDayWiseSale(dayWiseSaleDTO);
        return ResponseEntity.ok(savedId);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/list")
    public List<DayWiseSale> getSales(@RequestBody SalesRequestDTO requestDTO) {
        return dayWiseSaleService.getSales(requestDTO);
    }
}
