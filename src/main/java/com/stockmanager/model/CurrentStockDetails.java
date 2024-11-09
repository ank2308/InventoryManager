package com.stockmanager.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CurrentStockDetails {
    private String brandName;
    private BrandType brandType;
    private LiquorQuantity liquorQuantity;
    private int totalCrateLotQuantityLeft;
    private int totalLiquorQuantityLeft;
    private double totalPrice;

}
