package com.stockmanager.repository;

import com.stockmanager.model.Address;
import com.stockmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressDataRepository extends JpaRepository<Address, Long> {
}
