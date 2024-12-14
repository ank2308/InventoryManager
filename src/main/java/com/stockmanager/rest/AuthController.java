package com.stockmanager.rest;

import com.stockmanager.model.AppUser;
import com.stockmanager.model.User;
import com.stockmanager.repository.AppUserRepository;
import com.stockmanager.repository.UserDataRepository;
import com.stockmanager.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    @Autowired
    private UserDataRepository userDataRepository;

    public AuthController(AuthenticationManager authenticationManager, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/hello")
    public String hello(){
        log.info("hello");
        return "hello";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AppUser appUser) {
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword())); // Hash the password
        appUserRepository.save(appUser);
        return ResponseEntity.ok("User registered successfully!");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser appUser) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            appUser.getUsername(),
                            appUser.getPassword()
                    )
            );

            // Retrieve roles from authenticated user
            List<String> roles = authentication.getAuthorities()
                    .stream()
                    .map(authority -> authority.getAuthority())
                    .toList();

            // Generate tokens
            String token = jwtUtils.generateToken(appUser.getUsername(), roles);
            String refreshToken = jwtUtils.generateRefreshToken(appUser.getUsername());

            User user = userDataRepository.findByUsername(appUser.getUsername());

            if(!roles.contains("ROLE_ADMIN")) {

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "refreshToken", refreshToken,
                        "roles", roles,
                        "userId", user.getId()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "refreshToken", refreshToken,
                        "roles", roles,
                        "userId", 0
                ));
            }


        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}
