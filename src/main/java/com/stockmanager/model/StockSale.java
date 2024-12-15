package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "StockSale")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class StockSale {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(name = "User_Id", nullable = false)
    private Long userId;

    @Column(name = "Shop_Id", nullable = false)
    private Long shopId;

    @Column(name = "Total_Items_Left", nullable = false)
    private int totalItemsLeft;

    @Column(name = "Brand_Name", nullable = false)
    private String brandName;

    @Column(name = "Brand_Type", nullable = false)
    private String brandType;

    @Column(name="Items_Sold", nullable = false)
    private int itemsSold;

    @Column(name="Brand_Quantity_Id")
    private Long brandQuantityId;
}
