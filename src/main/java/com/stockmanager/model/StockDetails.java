package com.stockmanager.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class StockDetails {

    private String brandName;
    private String brandType;
    private int totalCrateLotQuantity;
    private int totalLiquorQuantity;
    private double totalPrice;

}
