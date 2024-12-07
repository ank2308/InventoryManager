package com.stockmanager.repository;

import com.stockmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<User, Long> {

    // Check if a username already exists
    boolean existsByUsername(String username);

    User findByUsername(String username);

    // Fetch paginated users
    @Override
    Page<User> findAll(Pageable pageable);

    // Fetch a user along with their addresses
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.id = :id")
    Optional<User> findByIdWithAddresses(Long id);

    @Query("SELECT u FROM User u WHERE u.username NOT IN (SELECT a.username FROM AppUser a)")
    List<User> findUsersWithoutAppUser();
}
