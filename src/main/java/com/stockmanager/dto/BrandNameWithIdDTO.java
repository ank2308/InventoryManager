package com.stockmanager.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BrandNameWithIdDTO {
    private Long brandId;
    private String brandName;

}
