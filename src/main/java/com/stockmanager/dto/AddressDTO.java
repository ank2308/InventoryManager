package com.stockmanager.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String shopNo;
    private String area;
    private String city;
    private String state;
    private String pincode;
}
