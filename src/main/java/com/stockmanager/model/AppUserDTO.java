package com.stockmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AppUserDTO {
    private Long id;
    
    private String username;
    private String password;
    private String licenseNo;
    private Set<Role> roles;
}
