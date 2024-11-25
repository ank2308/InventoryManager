package com.stockmanager.rest;

import com.stockmanager.model.*;
import com.stockmanager.service.BrandDetailsService;
import com.stockmanager.service.DayWiseSaleService;
import com.stockmanager.service.StockDataService;
import com.stockmanager.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserDataService userDataService;


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add-user")
    public ResponseEntity<User> addUserData (@RequestBody User user) {
        User savedUserData = userDataService.addUserData(user);
        return ResponseEntity.ok(savedUserData);
    }
}
