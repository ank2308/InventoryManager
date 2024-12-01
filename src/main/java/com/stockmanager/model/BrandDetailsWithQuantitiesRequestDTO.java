package com.stockmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BrandDetailsWithQuantitiesRequestDTO {
    private Long brandId;
    private String brandName; // Brand details
    private String brandType;
    private String description;
    private List<QuantityMappingDTO> quantityMappings;

    @Getter
    public static class QuantityMappingDTO {
        private Long quantityId; // Quantity ID (e.g., 375ml)
        private float mrp;       // MRP for the specific quantity
    }
}
