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

    @Column(name = "Brand_Name", nullable = false)
    private String brandName;

    @Column(name = "Brand_Type", nullable = false)
    private String brandType;

    @Column(name = "Crate_Lot_Size", nullable = false)
    private int crateLotSize;

    @Column(name = "Crate_Quantity", nullable = false)
    private int crateQuantity;

    @Column(name = "Liquor_Quantity_In_Crate", nullable = false)
    private int liquorQuantityInCrate;

    @Column(name="MRP", nullable = false)
    private double mrp;

    @Column(name="Margin_Price", nullable = false)
    private double marginPrice;

    @Column(name="Date_Of_Mgf")
    private Date dateOfMgf;

    @Column(name="Date_Entered", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateEntered = new Date();
}

