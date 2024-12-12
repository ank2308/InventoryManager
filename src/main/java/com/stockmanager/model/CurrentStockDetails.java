package com.stockmanager.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CurrentStockDetails {
    private String brandName;
    private String brandType;
    private String liquorQuantity;
    private int totalItemsLeft;
    private int totalLiquorQuantityLeft;
    private double totalPrice;
    private String warehouseNumber;

}
