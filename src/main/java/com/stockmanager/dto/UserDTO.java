package com.stockmanager.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String licenseNo;
    private Date licenseExpiry;
    private String phoneNo;
    private String email;
    private List<ShopDTO> shops;
}
