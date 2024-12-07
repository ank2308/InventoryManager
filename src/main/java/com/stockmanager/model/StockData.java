package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "StockData")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class StockData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "User_Id", nullable = false)
    private Long userId;

    @Column(name = "Brand_Name", nullable = false)
    private String brandName;

    @Column(name = "Brand_Type", nullable = false)
    private String brandType;

    @Column(name = "Lot_Size", nullable = false)
    private int lotSize;

    @Column(name = "Crate_In_Lot", nullable = false)
    private int crateInLot;

    @Column(name = "Items_In_Crate", nullable = false)
    private int itemsInCrate;

    @Column(name = "Total_Liquor_Quantity", nullable = true)
    private int totalLiquorQuantity;

    @Column(name = "Total_Items", nullable = false)
    private int totalItems;

    @Column(name="MRP", nullable = false)
    private double mrp;

    @Column(name="Margin_Price", nullable = false)
    private double marginPrice;

    @Column(name="Date_Of_Mgf")
    private Date dateOfMgf;

    @Column(name="Quantity_Id")
    private Long quantityId;

    @Column(name="Brand_Quantity_Id")
    private Long brandQuantityId;

    @Column(name="Date_Entered", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateEntered = new Date();
}

