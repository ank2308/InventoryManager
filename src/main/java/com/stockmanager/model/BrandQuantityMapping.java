package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "brand_quantity_mapping")
public class BrandQuantityMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private BrandDetails brandDetails;

    @ManyToOne
    @JoinColumn(name = "quantity_id", nullable = false)
    private Quantity quantity;

    @Column(nullable = false)
    private float mrp;

}