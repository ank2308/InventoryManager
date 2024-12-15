package com.stockmanager.service;

import com.stockmanager.dto.AddressDTO;
import com.stockmanager.dto.ShopDTO;
import com.stockmanager.dto.UserDTO;
import com.stockmanager.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDTOService {

    public UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setUsername(user.getUsername());
        userDTO.setPhoneNo(user.getPhoneNo());
        userDTO.setEmail(user.getEmail());

        List<ShopDTO> shops = user.getShops().stream().map(shop -> {
            ShopDTO shopDTO = new ShopDTO();
            shopDTO.setId(shop.getId());
            shopDTO.setShopName(shop.getShopName());
            shopDTO.setShopNo(shop.getShopNo());
            shopDTO.setLicenseNo(shop.getLicenseNo());
            shopDTO.setLicenseExpiry(shop.getLicenseExpiry());
            shopDTO.setShopPhoneNumber(shop.getShopPhoneNumber());
            shopDTO.setArea(shop.getArea());
            shopDTO.setCity(shop.getCity());
            shopDTO.setState(shop.getState());
            shopDTO.setPincode(shop.getPincode());
            return shopDTO;
        }).collect(Collectors.toList());

        userDTO.setShops(shops);
        return userDTO;
    }

}
