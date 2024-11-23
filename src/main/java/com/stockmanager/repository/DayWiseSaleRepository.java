package com.stockmanager.repository;

import com.stockmanager.model.DayWiseSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface DayWiseSaleRepository extends JpaRepository<DayWiseSale, Long> {

    // Fetch sales for a specific user on a specific date
    List<DayWiseSale> findByUserIdAndDateOfSale(Long userId, Date dateOfSale);

    // Fetch sales in a date range for a specific user
    // Custom query to fetch sales for a specific user within a date range
    @Query("SELECT d FROM DayWiseSale d WHERE d.userId = :userId AND d.dateOfSale BETWEEN :startDate AND :endDate")
    List<DayWiseSale> findSalesInDateRange(Long userId, Date startDate, Date endDate);
}
