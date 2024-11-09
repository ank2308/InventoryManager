package com.stockmanager.service;

import com.stockmanager.model.DayWiseSale;
import com.stockmanager.model.DayWiseSaleDTO;
import com.stockmanager.repository.DayWiseSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DayWiseSaleService {

    @Autowired
    private DayWiseSaleRepository dayWiseSaleRepository;

    public Long addDayWiseSale(DayWiseSaleDTO dto) {
        DayWiseSale dayWiseSale = new DayWiseSale();
        dayWiseSale.setUserId(dto.getUserId());
        dayWiseSale.setBrandName(dto.getBrandName());
        dayWiseSale.setBrandType(dto.getBrandType().toString());
        dayWiseSale.setLiquorQuantity(dto.getLiquorQuantity().getQuantityInMl());
        dayWiseSale.setQuantity(dto.getQuantity());
        dayWiseSale.setMrp(dto.getMrp());
        dayWiseSale.setDateOfSale(dto.getDateOfSale());

        return dayWiseSaleRepository.save(dayWiseSale).getId();
    }
}
