package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class DayWiseSaleDTO {
    private Long id;
    private int userId;
    private String brandName;
    private BrandType brandType;
    private LiquorQuantity liquorQuantity;
    private double quantity;

    private double mrp;

    private Date dateOfSale;
}
