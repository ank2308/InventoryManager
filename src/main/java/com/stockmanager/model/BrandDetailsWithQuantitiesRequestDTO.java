package com.stockmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BrandDetailsWithQuantitiesRequestDTO {
    private BrandDetails brandDetails;
    private List<Long> quantityIds;
}
