package com.stockmanager.repository;

import com.stockmanager.model.Quantity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuantityRepository extends JpaRepository<Quantity, Long> {

}
