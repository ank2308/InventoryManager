package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Brand_Details", uniqueConstraints = { @UniqueConstraint(columnNames = { "brandName", "brandType" }) })
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BrandDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String brandName;

    @Column(nullable = false)
    private String brandType;

    @ManyToMany
    @JoinTable(
            name = "brand_quantity_mapping",
            joinColumns = @JoinColumn(name = "brand_id"),
            inverseJoinColumns = @JoinColumn(name = "quantity_id")
    )
    private Set<Quantity> quantities; // Many-to-many relationship with quantities
}
