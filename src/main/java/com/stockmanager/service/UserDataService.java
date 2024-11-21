package com.stockmanager.service;

import com.stockmanager.model.Address;
import com.stockmanager.model.User;
import com.stockmanager.repository.AddressDataRepository;
import com.stockmanager.repository.UserDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserDataService {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private AddressDataRepository addressDataRepository;

    @Transactional
    public User addUserData (User user) {
        // Persist user (this will automatically persist the associated addresses due to cascading)
        User savedUser = userDataRepository.save(user);

        // Persist each address associated with the user
        for (Address address : user.getAddresses()) {
            address.setUser(savedUser); // Make sure each address is linked to the saved user
        }
        addressDataRepository.saveAll(user.getAddresses());

        return savedUser;
    }
}
