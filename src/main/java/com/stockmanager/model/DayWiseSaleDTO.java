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
    private Long userId;
    private String brandType;
    private String brandName;
//    private LiquorQuantity liquorQuantity;
    private String liquorQuantity;
    private int quantity;

    private double mrp;

    private Date dateOfSale;
}
