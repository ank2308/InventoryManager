package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Brand_Details")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BrandDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Brand_Name", nullable = false)
    private String brandName;

    @Column(name = "Brand_Type", nullable = false)
    private String brandType;
}
