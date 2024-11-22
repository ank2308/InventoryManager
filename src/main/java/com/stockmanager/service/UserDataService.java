package com.stockmanager.service;

import com.stockmanager.model.Address;
import com.stockmanager.model.User;
import com.stockmanager.repository.AddressDataRepository;
import com.stockmanager.repository.UserDataRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserDataService {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private AddressDataRepository addressDataRepository;

    @Transactional
    public User addUserData (User savedUser) {
        try {
            User u = new User();
            u.setName(savedUser.getName());
            u.setEmail(savedUser.getEmail());
            u.setLicenseNo(savedUser.getLicenseNo());
            u.setLicenseExpiry(savedUser.getLicenseExpiry());
            u.setPhoneNo(savedUser.getPhoneNo());
            userDataRepository.save(u);
            for (Address address : savedUser.getAddresses()) {
                Address newAddress = new Address();
                newAddress.setCity(address.getCity());
                newAddress.setState(address.getState());
                newAddress.setArea(address.getArea());
                newAddress.setPincode(address.getPincode());
                newAddress.setShopNo(address.getShopNo());
                newAddress.setUser(u);
                addressDataRepository.save(newAddress);
            }            
            return userDataRepository.getReferenceById(u.getId());
        } catch (Exception e) {
            // Handle specific exceptions (e.g., database constraint violations)
            log.error(e.getMessage());
        }
        return null;
    }
}
