package com.stockmanager.service;

import com.stockmanager.model.BrandDetails;
import com.stockmanager.model.BrandType;
import com.stockmanager.model.LiquorQuantity;
import com.stockmanager.model.StockData;
import com.stockmanager.repository.BrandDetailsRepository;
import com.stockmanager.repository.StockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BrandDetailsService {

    @Autowired
    private BrandDetailsRepository brandDetailsRepository;

    @Autowired
    private StockDataRepository stockDataRepository;

    // Fetch all brand details
    public List<BrandDetails> getAllBrands() {
        return brandDetailsRepository.findAll();
    }

    // Method to add new brand details
    public BrandDetails addBrandDetails(BrandDetails brandDetails) {
        return brandDetailsRepository.save(brandDetails);
    }

    // find all brand types
    public List<String> getBrandTypes() {
        return brandDetailsRepository.findAllBrandTypes();
    }

    public List<String> getAllBrandTypesByUserId(Long userId) {
        return stockDataRepository.findAvailableBrandTypesByUserId(userId);
    }

    public Map<String, List<String>> getAllBrandNamesByUserIdByBrandType(Long userId, String brandType) {
         List<Object[]> results = stockDataRepository.findAvailableBrandNamesByUserIdByBrandType(userId, brandType);
         Map<String, List<String>> map = new HashMap<>();
         for (Object[] stockData : results) {
             String brandName = (String) stockData[0];
             int liquorQuantityInCrate = (Integer) stockData[1];
             map.computeIfAbsent(brandName, k -> new ArrayList<>())
                     .add(LiquorQuantity.fromInt(liquorQuantityInCrate).name());
         }
         return map;
    }

    public List<String> getAllBrandTypes() {
        return brandDetailsRepository.findAll()
                .stream()
                .map(BrandDetails::getBrandType)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<BrandDetails> getBrandsByType(String brandType) {
        return brandDetailsRepository.findByBrandType(brandType);
    }

    public List<String> getBrandNamesByType(String brandType) {
        return brandDetailsRepository.findByBrandType(brandType)
                .stream()
                .map(BrandDetails::getBrandName)
                .collect(Collectors.toList());
    }

    /**
     * Updates the brand name for the given ID.
     *
     * @param id          the ID of the brand to update
     * @param newBrandName the new brand name
     * @return true if the update was successful, false otherwise
     */
    public boolean updateBrandName(Long id, String newBrandName) {
        Optional<BrandDetails> optionalBrandDetails = brandDetailsRepository.findById(id);

        if (optionalBrandDetails.isPresent()) {
            BrandDetails brandDetails = optionalBrandDetails.get();
            brandDetails.setBrandName(newBrandName);
            brandDetailsRepository.save(brandDetails); // Save the updated entity
            return true; // Update successful
        }
        return false; // Update failed, brand not found
    }

    /**
     * Deletes the brand with the given ID.
     *
     * @param id the ID of the brand to delete
     * @return true if the deletion was successful, false otherwise
     */
    public boolean deleteBrand(Long id) {
        if (brandDetailsRepository.existsById(id)) {
            brandDetailsRepository.deleteById(id); // Delete the entity
            return true; // Deletion successful
        }
        return false; // Deletion failed, brand not found
    }
}