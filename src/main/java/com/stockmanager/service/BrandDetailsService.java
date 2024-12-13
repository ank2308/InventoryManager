package com.stockmanager.service;

import com.stockmanager.dto.BrandNameWithIdDTO;
import com.stockmanager.dto.BrandStockUserDTO;
import com.stockmanager.dto.SaleQuantityDTO;
import com.stockmanager.exception.DuplicateBrandNameException;
import com.stockmanager.model.*;
import com.stockmanager.repository.BrandDetailsRepository;
import com.stockmanager.repository.BrandQuantityMappingRepository;
import com.stockmanager.repository.QuantityRepository;
import com.stockmanager.repository.StockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BrandDetailsService {

    @Autowired
    private BrandDetailsRepository brandDetailsRepository;
    @Autowired
    private BrandQuantityMappingRepository brandQuantityMappingRepository;
    @Autowired
    private QuantityRepository quantityRepository;
    @Autowired
    private StockSaleDataService stockSaleDataService;

    // Fetch all brand details
    public Page<BrandDetails> getAllBrands(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return brandDetailsRepository.findAll(pageable);
    }

    // Method to add new brand details
    public BrandDetails addBrandDetails(BrandDetails brandDetails) {
        return brandDetailsRepository.save(brandDetails);
    }

    public BrandDetails addBrandDetailsWithQuantity(BrandDetailsWithQuantitiesRequestDTO request) {
        try {
            BrandDetails brandDetails;
            // 1. Check if we are updating or creating a new brand
            if (request.getBrandId() != null) {
                // Update existing brand
                brandDetails = brandDetailsRepository.findById(request.getBrandId())
                        .orElseThrow(() -> new RuntimeException("Brand not found"));
                brandDetails.setBrandName(request.getBrandName());
                brandDetails.setBrandType(request.getBrandType());
                brandDetails.setDescription(request.getDescription());
            } else {
                // Create a new brand
                brandDetails = new BrandDetails();
                brandDetails.setBrandName(request.getBrandName());
                brandDetails.setBrandType(request.getBrandType());
                brandDetails.setDescription(request.getDescription());
            }

            // Save the brand details
            brandDetails = brandDetailsRepository.save(brandDetails);

            // 2. Process quantity mappings
            for (BrandDetailsWithQuantitiesRequestDTO.QuantityMappingDTO mapping : request.getQuantityMappings()) {
                // Fetch the Quantity
                Quantity quantity = quantityRepository.findById(mapping.getQuantityId())
                        .orElseThrow(() -> new RuntimeException("Quantity not found"));

                // Check if the mapping already exists
                BrandQuantityMapping existingMapping = (BrandQuantityMapping) brandQuantityMappingRepository
                        .findByBrandDetailsAndQuantity(brandDetails, quantity)
                        .orElse(null);

                if (existingMapping == null) {
                    // Create a new mapping
                    BrandQuantityMapping newMapping = new BrandQuantityMapping();
                    newMapping.setBrandDetails(brandDetails);
                    newMapping.setQuantity(quantity);
                    newMapping.setMrp(mapping.getMrp());
                    brandQuantityMappingRepository.save(newMapping);
                } else {
                    // Update existing mapping
                    existingMapping.setMrp(mapping.getMrp());
                    brandQuantityMappingRepository.save(existingMapping);
                }
            }
            return brandDetails;
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateBrandNameException("Brand name already exists. Please choose a different name.");
        }
}


    // find all brand types
    public List<String> getBrandTypes() {
        return brandDetailsRepository.findAllBrandTypes();
    }

    public List<String> getAllBrandTypesByUserId(Long userId) {
        List<StockSale> stockSales = stockSaleDataService.findAllByUserIdAndTotalItemsGreaterThanZero(userId);
        List<String> brandTypeList = new ArrayList<>();
        stockSales.stream().map(StockSale::getBrandType).distinct().forEach(brandTypeList::add);
        return brandTypeList;
    }

    public List<String> getAllBrandNamesByUserIdByBrandType(Long userId, String brandType) {
         return stockSaleDataService.findAllByUserIdAndBrandTypeAndTotalItemsLessThanZero(userId, brandType);
    }

    public List<String> getAllBrandTypes() {
        return brandDetailsRepository.findAll()
                .stream()
                .map(BrandDetails::getBrandType)
                .distinct()
                .collect(Collectors.toList());
    }

    public BrandDetails getBrandDetailsByName(String brandName) throws Exception {
        List<BrandDetails> details = brandDetailsRepository.findByBrandName(brandName);
        if(details.size() >1 || details.size() == 0 ){
            throw new Exception("Details for brand either does not exist or more than 1 record exists");
        }
        return details.get(0);
    }

    /**
     * Fetch brand details along with quantities and MRPs.
     */
    public BrandDetailsWithQuantitiesResponseDTO getBrandDetailsWithQuantities(Long brandId) {
        // Fetch the brand details
        BrandDetails brandDetails = brandDetailsRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Prepare the response DTO
        BrandDetailsWithQuantitiesResponseDTO response = new BrandDetailsWithQuantitiesResponseDTO();
        response.setBrandId(brandDetails.getId());
        response.setBrandName(brandDetails.getBrandName());
        response.setBrandType(brandDetails.getBrandType());
        response.setDescription(brandDetails.getDescription());

        // Fetch the quantity mappings
        List<BrandDetailsWithQuantitiesResponseDTO.QuantityWithMrpDTO> quantityMappings = brandQuantityMappingRepository
                .findByBrandDetails(brandDetails)
                .stream()
                .map(mapping -> {
                    BrandDetailsWithQuantitiesResponseDTO.QuantityWithMrpDTO dto = new BrandDetailsWithQuantitiesResponseDTO.QuantityWithMrpDTO();
                    dto.setQuantityId(mapping.getQuantity().getId());
                    dto.setQuantityName(mapping.getQuantity().getQuantityName());
                    dto.setQuantity(mapping.getQuantity().getQuantity());
                    dto.setMrp(mapping.getMrp());
                    dto.setBrandQuantityId(mapping.getId());
                    return dto;
                })
                .toList();

        response.setQuantityMappings(quantityMappings);

        return response;
    }

    public List<BrandNameWithIdDTO> getBrandNamesByType(String brandType) {
        return brandDetailsRepository.findByBrandType(brandType)
                .stream()
                .map(brand -> new BrandNameWithIdDTO(brand.getId(), brand.getBrandName()))
                .collect(Collectors.toList());
    }

    public List<Quantity> getQuantitiesForBrand(String brandName) {
        return brandDetailsRepository.findQuantitiesByBrandName(brandName);
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

    public List<BrandDetails> findByNameContaining(String name) {
        return brandDetailsRepository.findByBrandNameContainingIgnoreCase(name);
    }

    public List<String> findBrandNamesContaining(String query) {
        return brandDetailsRepository.findBrandNamesContainingIgnoreCase(query);
    }
}