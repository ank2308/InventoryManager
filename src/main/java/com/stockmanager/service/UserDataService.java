package com.stockmanager.service;

import com.stockmanager.model.User;
import com.stockmanager.repository.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserDataService {

    @Autowired
    private UserDataRepository userDataRepository;

    public User addUserData (User user) {
        return userDataRepository.save(user);
    }
}
