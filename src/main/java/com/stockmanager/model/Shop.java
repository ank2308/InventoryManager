package com.stockmanager.model;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Shop")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column(name = "shop_No", nullable = false)
    private String shopNo;

    @Column(name = "license_no", nullable = false)
    private String licenseNo;

    @Column(name = "license_expiry", nullable = false)
    private Date licenseExpiry;

    @Column(name = "shop_phone_number", nullable = false)
    private String shopPhoneNumber;

    @Column(name = "area", nullable = false)
    private String area;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
}
