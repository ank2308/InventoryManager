package com.stockmanager.rest;

import com.stockmanager.dto.UserDTO;
import com.stockmanager.model.*;
import com.stockmanager.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserDataService userDataService;
    @Autowired
    private UserDTOService userDTOService;

    // Add a new user
    @PostMapping("/add-user")
    public ResponseEntity<User> addUserData(@RequestBody User user) {
        User savedUserData = userDataService.addUserData(user);
        return ResponseEntity.ok(savedUserData);
    }

    // Fetch paginated user data
    @GetMapping("/getAllUsers")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<User> response = userDataService.getAllUser(page, size);
        return ResponseEntity.ok(response);
    }

    // Fetch full details of a specific user, including addresses
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        User user = userDataService.getUserWithShops(userId);
        UserDTO userDTO = userDTOService.toUserDTO(user);

        return ResponseEntity.ok(userDTO);
    }

    // Update an existing user
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {
        log.info("Update request for userId {}: {}", userId, updatedUser);
        User user = userDataService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }

    // Delete a user and associated addresses
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userDataService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/without-appuser")
    public ResponseEntity<List<User>> getUsersWithoutAppUser() {
        List<User> users = userDataService.getUsersWithoutAppUser();
        return ResponseEntity.ok(users);
    }
}
