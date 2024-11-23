package com.stockmanager.service;

import com.stockmanager.model.Quantity;
import com.stockmanager.repository.QuantityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuantityService {

    @Autowired
    private QuantityRepository quantityRepository;

    // Fetch all quantities type
    public List<Quantity> getAllQuantities() {
        return quantityRepository.findAll();
    }

}