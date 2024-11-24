package com.stockmanager.rest;

import com.stockmanager.model.AppUser;
import com.stockmanager.repository.AppUserRepository;
import com.stockmanager.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
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

            return ResponseEntity.ok(Map.of(
                    "accessToken", token,
                    "refreshToken", refreshToken
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}
