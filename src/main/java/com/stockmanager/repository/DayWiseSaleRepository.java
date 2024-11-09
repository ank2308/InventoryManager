package com.stockmanager.repository;

import com.stockmanager.model.DayWiseSale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayWiseSaleRepository extends JpaRepository<DayWiseSale, Long> {
}
