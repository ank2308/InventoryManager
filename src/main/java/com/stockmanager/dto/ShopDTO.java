package com.stockmanager.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class ShopDTO {
    private Long id;
    private String shopName;
    private String licenseNo;
    private Date licenseExpiry;
    private String shopNo;
    private String shopPhoneNumber;
    private String area;
    private String city;
    private String state;
    private String pincode;
    
}
