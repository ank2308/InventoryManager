package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quantity")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Quantity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity", nullable = false)
    private int quantity; // Store quantities like 175, 375, 750

    @Column(name = "quantity_name", nullable = false)
    private String quantityName; // Store descriptive name for the quantity (e.g., Pint, Large)

}