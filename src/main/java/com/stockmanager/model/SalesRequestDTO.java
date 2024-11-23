package com.stockmanager.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SalesRequestDTO {

    private Long userId;
    private DateRangeType selectedDateRange;
    private Date startDate; // Only used for CUSTOM range
    private Date endDate;   // Only used for CUSTOM range

    // Getters and Setters
}
