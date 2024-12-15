package com.stockmanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockmanager.dto.ShopWithNameLicenseDTO;
import com.stockmanager.model.Shop;
import com.stockmanager.repository.ShopDataRepository;



@Service
public class ShopDataService {

    @Autowired
    ShopDataRepository shopDataRepository;

    public List<ShopWithNameLicenseDTO> getAllShopsByUserId(Long userId) {
        List<ShopWithNameLicenseDTO> shops = shopDataRepository.findByUserId(userId);
        return shops;
    }
}
