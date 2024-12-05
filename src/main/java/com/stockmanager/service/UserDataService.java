package com.stockmanager.service;

import com.stockmanager.model.Address;
import com.stockmanager.model.User;
import com.stockmanager.repository.AddressDataRepository;
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
            user.setLicenseNo(savedUser.getLicenseNo());
            user.setLicenseExpiry(savedUser.getLicenseExpiry());
            user.setPhoneNo(savedUser.getPhoneNo());
            user.setAddresses(new ArrayList<>()); // Initialize addresses list
            userDataRepository.save(user);

            // Save addresses and link to user
            List<Address> addressesToSave = new ArrayList<>();
            for (Address address : savedUser.getAddresses()) {
                Address newAddress = new Address();
                newAddress.setCity(address.getCity());
                newAddress.setState(address.getState());
                newAddress.setArea(address.getArea());
                newAddress.setPincode(address.getPincode());
                newAddress.setShopNo(address.getShopNo());
                newAddress.setUser(user); // Set bi-directional mapping
                addressesToSave.add(newAddress);
                user.getAddresses().add(newAddress);
            }
            addressDataRepository.saveAll(addressesToSave);
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
    public User getUserWithAddresses(Long id) {
        return userDataRepository.findByIdWithAddresses(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update an existing user
    @Transactional
    public User updateUser(Long userId, User updatedUser) {
        User existingUser = userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user fields
        existingUser.setName(updatedUser.getName());
        existingUser.setLicenseNo(updatedUser.getLicenseNo());
        existingUser.setLicenseExpiry(updatedUser.getLicenseExpiry());
        existingUser.setPhoneNo(updatedUser.getPhoneNo());
        existingUser.setEmail(updatedUser.getEmail());

        // Update addresses
        List<Address> updatedAddresses = updatedUser.getAddresses();
        List<Address> existingAddresses = existingUser.getAddresses();

        // Remove addresses not in the updated list
        existingAddresses.removeIf(existingAddress ->
                updatedAddresses.stream()
                        .noneMatch(updatedAddress -> updatedAddress.getId().equals(existingAddress.getId()))
        );

        // Add or update addresses
        for (Address updatedAddress : updatedAddresses) {
            Address address = existingAddresses.stream()
                    .filter(existingAddress -> existingAddress.getId().equals(updatedAddress.getId()))
                    .findFirst()
                    .orElse(new Address());

            address.setShopNo(updatedAddress.getShopNo());
            address.setArea(updatedAddress.getArea());
            address.setCity(updatedAddress.getCity());
            address.setState(updatedAddress.getState());
            address.setPincode(updatedAddress.getPincode());
            address.setUser(existingUser);

            if (address.getId() == null) {
                existingAddresses.add(address);
            }
        }

        existingUser.setAddresses(existingAddresses);
        return userDataRepository.save(existingUser);
    }

    // Delete a user and their addresses
    @Transactional
    public void deleteUser(Long userId) {
        User user = userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete associated addresses
        List<Address> addresses = user.getAddresses();
        addressDataRepository.deleteAll(addresses);

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
        if (user.getLicenseNo() == null || user.getLicenseNo().isBlank()) {
            throw new IllegalArgumentException("License number cannot be empty.");
        }
        if (user.getLicenseExpiry() == null) {
            throw new IllegalArgumentException("License expiry date cannot be null.");
        }
        if (user.getAddresses() == null || user.getAddresses().isEmpty()) {
            throw new IllegalArgumentException("At least one address is required.");
        }
    }

    public List<User> getUsersWithoutAppUser() {
        return userDataRepository.findUsersWithoutAppUser();
    }
}
