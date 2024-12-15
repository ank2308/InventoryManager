package com.stockmanager.repository;
import com.stockmanager.dto.ShopWithNameLicenseDTO;
import com.stockmanager.model.Shop;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopDataRepository extends JpaRepository<Shop, Long> {
    
    @Query("SELECT new com.stockmanager.dto.ShopWithNameLicenseDTO(s.id, s.shopName, s.licenseNo, s.user.id)    FROM Shop s WHERE s.user.id = :userId")
    List<ShopWithNameLicenseDTO> findByUserId(Long userId);
}
