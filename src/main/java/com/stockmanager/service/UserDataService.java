package com.stockmanager.service;

import com.stockmanager.model.Address;
import com.stockmanager.model.Shop;
import com.stockmanager.model.User;
import com.stockmanager.repository.AddressDataRepository;
import com.stockmanager.repository.ShopDataRepository;
import com.stockmanager.repository.UserDataRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UserDataService {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private AddressDataRepository addressDataRepository;

    @Autowired
    private ShopDataRepository shopDataRepository;

    // Add a new user with addresses
    @Transactional
    public User addUserData(User savedUser) {
        try {
            validateUser(savedUser);

            if (userDataRepository.existsByUsername(savedUser.getUsername())) {
                throw new IllegalArgumentException("Username '" + savedUser.getUsername() + "' already exists.");
            }

            // Save the user
            User user = new User();
            user.setUsername(savedUser.getUsername());
            user.setName(savedUser.getName());
            user.setEmail(savedUser.getEmail());
            user.setPhoneNo(savedUser.getPhoneNo());
            user.setShops(new ArrayList<>()); // Initialize addresses list
            userDataRepository.save(user);

            // Save addresses and link to user
            List<Shop> shopsToSave = new ArrayList<>();
            for (Shop shop : savedUser.getShops()) {
                Shop newShop = new Shop();
                newShop.setShopNo(shop.getShopNo());
                newShop.setShopName(shop.getShopName());
                newShop.setLicenseNo(shop.getLicenseNo());
                newShop.setLicenseExpiry(shop.getLicenseExpiry());
                newShop.setShopPhoneNumber(shop.getShopPhoneNumber());
                newShop.setCity(shop.getCity());
                newShop.setState(shop.getState());
                newShop.setArea(shop.getArea());
                newShop.setPincode(shop.getPincode());
                newShop.setUser(user); // Set bi-directional mapping
                shopsToSave.add(newShop);
                user.getShops().add(newShop);
            }
            shopDataRepository.saveAll(shopsToSave);
            userDataRepository.save(user);

            return user;
        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during user creation: {}", e.getMessage());
            throw new RuntimeException("Failed to create user. Please try again later.", e);
        }
    }

    // Fetch paginated users
    public Page<User> getAllUser(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userDataRepository.findAll(pageable);
    }

    // Fetch user by ID with addresses
    public User getUserWithShops(Long id) {
        return userDataRepository.findByIdWithShops(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update an existing user
    @Transactional
    public User updateUser(Long userId, User updatedUser) {
        User existingUser = userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user fields
        existingUser.setName(updatedUser.getName());
        existingUser.setPhoneNo(updatedUser.getPhoneNo());
        existingUser.setEmail(updatedUser.getEmail());
        
        // Update shop details
        List<Shop> updatedShops = updatedUser.getShops();
        List<Shop> existingShops = existingUser.getShops();

        // Remove addresses not in the updated list
        existingShops.removeIf(existingShop ->
                updatedShops.stream()
                        .noneMatch(updatedShop -> updatedShop.getId().equals(existingShop.getId()))
        );

        // Add or update shop
        for (Shop updatedShop : updatedShops) {
            Shop shop = existingShops.stream()
                    .filter(existingAddress -> existingAddress.getId().equals(updatedShop.getId()))
                    .findFirst()
                    .orElse(new Shop());

            shop.setShopName(updatedShop.getShopName());
            shop.setShopNo(updatedShop.getShopNo());
            shop.setLicenseNo(updatedShop.getLicenseNo());
            shop.setLicenseExpiry(updatedShop.getLicenseExpiry());
            shop.setShopPhoneNumber(updatedShop.getShopPhoneNumber());
            shop.setArea(updatedShop.getArea());
            shop.setCity(updatedShop.getCity());
            shop.setState(updatedShop.getState());
            shop.setPincode(updatedShop.getPincode());
            shop.setUser(existingUser);

            if (shop.getId() == null) {
                existingShops.add(shop);
            }
        }

        existingUser.setShops(existingShops);
        return userDataRepository.save(existingUser);
    }

    // Delete a user and their addresses
    @Transactional
    public void deleteUser(Long userId) {
        User user = userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete associated shops
        List<Shop> shops = user.getShops();
        shopDataRepository.deleteAll(shops);

        // Delete the user
        userDataRepository.delete(user);
    }

    // Validate user data
    private void validateUser(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty.");
        }
        if (user.getName() == null || user.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty.");
        }
        if (user.getShops() == null || user.getShops().isEmpty()) {
            throw new IllegalArgumentException("At least one address is required.");
        }
    }
    // TODO: add code to validate shop details

    public List<User> getUsersWithoutAppUser() {
        return userDataRepository.findUsersWithoutAppUser();
    }
}
