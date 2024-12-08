package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "DayWiseSale")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class DayWiseSale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "User_Id", nullable = false)
    private Long userId;

    @Column(name = "Brand_Name", nullable = false)
    private String brandName;

    @Column(name = "Brand_Type", nullable = false)
    private String brandType;

    @Column(name = "Quantity_Id", nullable = false)
    private int quantityId;

    @Column(name="Items_Sold", nullable = false)
    private int itemsSold;

    @Column(name="MRP", nullable = false)
    private double mrp;

    @Column(name="Date_Of_Sale")
    private Date dateOfSale;
}
