package com.stockmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShopWithNameLicenseDTO {
    private Long id;
    private String shopName;
    private String licenseNo;
    private Long userId;
}
