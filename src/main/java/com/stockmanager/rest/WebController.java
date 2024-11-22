package com.stockmanager.rest;

import com.stockmanager.model.*;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/web")
public class WebController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/q")
    public String showHomePage1(Model model) {
        // Call the REST API to fetch all brand names
        String apiUrl = "http://localhost:8080/api/stocks/getBrandNameList";
        List<String> brandNames = restTemplate.getForObject(apiUrl, List.class);

        // Add brand names to the model to pass to the view
        model.addAttribute("brandNames", brandNames);

        return "index";
    }

    @GetMapping("/")
    public String showHomePage(Model model) {
        // Call the REST API to fetch all brand names
        String apiUrl = "http://localhost:8080/api/stocks/details";
        List<CurrentStockDetails> stockDetailsList = restTemplate.getForObject(apiUrl, List.class);

        // Add brand names to the model to pass to the view
        model.addAttribute("stockDetailsList", stockDetailsList);

        return "index";
    }

    @PostMapping("/addStock/add")
    public ResponseEntity<StockData> addStockData(@RequestBody StockData stockData) {
        String stockAddUrl = "http://localhost:8080/api/stocks/add";
        StockData saveData = restTemplate.postForObject(stockAddUrl, stockData, StockData.class);
        return ResponseEntity.ok(saveData);
    }

    @GetMapping("/add-stock")
    public String showAddStockPage(Model model) {
        // Fetch distinct brand types
        String brandTypesApiUrl = "http://localhost:8080/api/stocks/brands/types";
        String[] brandTypes = restTemplate.getForObject(brandTypesApiUrl, String[].class);
        model.addAttribute("brandTypes", brandTypes);
        return "add-stock";  // This will return the add-stock.html from the templates directory
    }

    @PostMapping("/sale/day-wise")
    public ResponseEntity<Long> addDayWiseSale(@RequestBody DayWiseSaleDTO daywiseSaleDTO) {
        String stockAddUrl = "http://localhost:8080/api/sale/day-wise";
        Long  id = restTemplate.postForObject(stockAddUrl, daywiseSaleDTO, Long.class);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/add-sale")
    public String showAddSalePage(Model model) {
        // Fetch distinct brand types
        int userId = 1;
        String brandTypesByUseIdApiUrl = String.format("http://localhost:8080/api/stocks/brands/types/%d", userId);
        String[] brandTypes = restTemplate.getForObject(brandTypesByUseIdApiUrl, String[].class);
        model.addAttribute("brandTypes", brandTypes);

        String liquorQuantityInStockApiUrl = "http://localhost:8080/api/stocks/available-liquor-quantities";
        List<LiquorQuantity> liquorQuantities = restTemplate.getForObject(liquorQuantityInStockApiUrl, List.class);
        model.addAttribute("liquorQuantity", liquorQuantities);
        return "add-sale";  // This will return the add-stock.html from the templates directory
    }


    // New method to handle the brand details page
    @GetMapping("/brandnamedetails/{brandName}")
    public String showBrandDetails(@PathVariable String brandName, Model model) {
        // Call the API to get details for the selected brand
        String apiUrl = "http://localhost:8080/api/stocks/" + brandName;
        StockDetails stockDetails = restTemplate.getForObject(apiUrl, StockDetails.class);

        // Pass the brand name and details to the view
        model.addAttribute("brandName", brandName);
        model.addAttribute("stockDetails", stockDetails);

        return "brandnamedetails";  // Return the brandnamedetails.html template
    }

    // Fetch all brand details for the UI
    @GetMapping("/add-brand")
    public String showAddBrandPage(Model model) {
        String apiUrl = "http://localhost:8080/api/brands/getAllBrands";
        BrandDetails[] brandList = restTemplate.getForObject(apiUrl, BrandDetails[].class);
        model.addAttribute("brandList", brandList);
        return "add-brand"; // returns the view
    }

    @GetMapping("/select-brand-type")
    public String showBrandTypeSelectionPage(Model model) {
        // Fetch distinct brand types
        String brandTypesApiUrl = "http://localhost:8080/api/brands/types";
        String[] brandTypes = restTemplate.getForObject(brandTypesApiUrl, String[].class);
        model.addAttribute("brandTypes", brandTypes);
        return "select-brand-type";
    }

    // Endpoint to fetch brands for a selected brandType (returns JSON)
    @GetMapping("/brands/by-type/{brandType}")
    @ResponseBody
    public BrandDetails[] getBrandsByType(@PathVariable String brandType) {
        String brandsApiUrl = "http://localhost:8080/api/brands/by-type/" + brandType;
        return restTemplate.getForObject(brandsApiUrl, BrandDetails[].class);
    }

    // Endpoint to edit a brand
    @PutMapping("/brands/edit/{id}")
    public ResponseEntity<?> editBrand(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String url = String.format("http://localhost:8080/api/brands/edit/%d", id);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("brandName", request.get("brandName"));

        // Call the StockController API
        ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(requestBody), Map.class);

        return ResponseEntity.ok(response.getBody());
    }

    // Endpoint to delete a brand
    @DeleteMapping("/brands/delete/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        String url = String.format("http://localhost:8080/api/brands/delete/%d", id);

        // Call the StockController API
        restTemplate.delete(url);

        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    @GetMapping("/add-user")
    public String showAddUser(Model model) {
        model.addAttribute("user", new User());
        return "add-user";
    }

    // Function to save brand details by calling StockController API
    @PostMapping("/save-brand")
    public String saveBrandDetails(@ModelAttribute("brandDetails") BrandDetails brandDetails, Model model) {
        String apiUrl = "http://localhost:8080/api/brands/save";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<BrandDetails> request = new HttpEntity<>(brandDetails, headers);

        // Call the StockController API to save the brand
        ResponseEntity<BrandDetails> response = restTemplate.postForEntity(apiUrl, request, BrandDetails.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            model.addAttribute("successMessage", "Brand saved successfully");
        } else {
            model.addAttribute("successMessage", "Error saving brand");
        }

        return "redirect:/add-brand";
    }

    @PostMapping("/users/add")
    public ResponseEntity<User> addUserDetails(@RequestBody User user, Model model) {
        String url = "http://localhost:8080/api/user/add-user";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<User> request = new HttpEntity<>(user, headers);
        ResponseEntity<User> response = restTemplate.postForEntity(url, request, User.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            model.addAttribute("successMessage", "User saved successfully");
        } else {
            model.addAttribute("successMessage", "Error saving user");
        }

        return response;
    }

}
