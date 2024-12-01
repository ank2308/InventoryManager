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
public class BrandDetailsWithQuantitiesResponseDTO {
    private Long brandId;
    private String brandName;
    private String brandType;
    private String description;
    private List<QuantityWithMrpDTO> quantityMappings; // Quantities and their MRPs

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    public static class QuantityWithMrpDTO {
        private Long quantityId;
        private String quantityName; // e.g., Glass Bottle
        private int quantity;        // e.g., 750 ml
        private float mrp;           // e.g., 1500.00
    }
}