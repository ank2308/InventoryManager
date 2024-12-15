package com.stockmanager.dto;

import com.stockmanager.model.DateRangeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class StockRequestDTO {
    private Long userId;
    private Long shopId;
    private DateRangeType selectedDateRange;
    private Date startDate; // Only used for CUSTOM range
    private Date endDate;
}
