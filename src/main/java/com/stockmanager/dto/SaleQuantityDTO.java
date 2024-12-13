package com.stockmanager.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SaleQuantityDTO {
    private Long quantityId;
    private int quantity;
    private String quantityName;
    private float price;
    private Long brandQuantityId;
}
