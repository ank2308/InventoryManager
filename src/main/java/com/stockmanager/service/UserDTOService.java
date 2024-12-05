package com.stockmanager.service;

import com.stockmanager.dto.AddressDTO;
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
        userDTO.setLicenseNo(user.getLicenseNo());
        userDTO.setLicenseExpiry(user.getLicenseExpiry());
        userDTO.setPhoneNo(user.getPhoneNo());
        userDTO.setEmail(user.getEmail());

        List<AddressDTO> addresses = user.getAddresses().stream().map(address -> {
            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setId(address.getId());
            addressDTO.setShopNo(address.getShopNo());
            addressDTO.setArea(address.getArea());
            addressDTO.setCity(address.getCity());
            addressDTO.setState(address.getState());
            addressDTO.setPincode(address.getPincode());
            return addressDTO;
        }).collect(Collectors.toList());

        userDTO.setAddresses(addresses);
        return userDTO;
    }

}
