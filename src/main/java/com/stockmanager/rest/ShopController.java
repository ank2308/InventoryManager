package com.stockmanager.rest;
import com.stockmanager.dto.ShopWithNameLicenseDTO;
import com.stockmanager.model.*;
import com.stockmanager.service.ShopDataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RestControllerAdvice
public class ShopController {

    @Autowired
    private ShopDataService shopDataService;

    // API to save brand details
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/all/{userId}")
    public ResponseEntity<List<ShopWithNameLicenseDTO>> getAllShopsByUserId(@PathVariable Long userId) {
        List<ShopWithNameLicenseDTO> shops = shopDataService.getAllShopsByUserId(userId);
        return ResponseEntity.ok(shops);
    }
}
