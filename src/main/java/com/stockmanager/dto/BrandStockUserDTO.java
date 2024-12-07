package com.stockmanager.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class BrandStockUserDTO {
    private Long brandQuantityId;
    private String brandName;
    private int totalLiquorQuantity;
}
