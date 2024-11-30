package com.stockmanager.service;

import com.stockmanager.model.Address;
import com.stockmanager.model.AppUser;
import com.stockmanager.model.User;
import com.stockmanager.repository.AddressDataRepository;
import com.stockmanager.repository.AppUserRepository;
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

    @Autowired
    private AppUserRepository appUserRepository;

    @Transactional
    public User addUserData (User savedUser) {
        try {

            boolean userExists = userDataRepository.existsByUsername(savedUser.getUsername());

            if (userExists) {
                throw new RuntimeException("Username '" + savedUser.getUsername() + "' already exists in the system.");
            }

            User u = new User();
            u.setUsername(savedUser.getUsername());
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

//    @Transactional
//    public void linkAppUserToUser(String username) {
//        try {
//            User user = userDataRepository.findByUsername(username)
//                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
//            AppUser appUser = appUserRepository.findByUsername(username)
//                    .orElseThrow(() -> new RuntimeException("AppUser not found with username: " + username));
//
//            appUser.setUser(user); // Establish the link
//            appUserRepository.save(appUser); // Save the updated AppUser
//            log.info("Successfully linked AppUser '{}' to User '{}'", username, user.getId());
//        } catch (Exception e) {
//            log.error("Error while linking AppUser to User: {}", e.getMessage());
//        }
//    }
}
