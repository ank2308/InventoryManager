package com.stockmanager.service;

import com.stockmanager.model.BrandDetails;
import com.stockmanager.model.BrandType;
import com.stockmanager.model.StockData;
import com.stockmanager.repository.BrandDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BrandDetailsService {

    @Autowired
    private BrandDetailsRepository brandDetailsRepository;

    // Fetch all brand details
    public List<BrandDetails> getAllBrands() {
        return brandDetailsRepository.findAll();
    }

    // Method to add new brand details
    public BrandDetails addBrandDetails(BrandDetails brandDetails) {
        return brandDetailsRepository.save(brandDetails);
    }

    public List<String> getAllBrandTypes() {
//        return brandDetailsRepository.findAll()
//                .stream()
//                .map(BrandDetails::getBrandType)
//                .distinct()
//                .collect(Collectors.toList());
        return null;
    }

    public List<BrandDetails> getBrandsByType(String brandType) {
        return brandDetailsRepository.findByBrandType(brandType);
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