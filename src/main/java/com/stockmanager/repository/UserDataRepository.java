package com.stockmanager.repository;

import com.stockmanager.model.StockData;
import com.stockmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDataRepository extends JpaRepository<User, Long> {
    List<User> findUserByLicenseNo(String licenseNo);

}
