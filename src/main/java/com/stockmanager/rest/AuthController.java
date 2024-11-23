package com.stockmanager.rest;

import com.stockmanager.model.AppUser;
import com.stockmanager.repository.AppUserRepository;
import com.stockmanager.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {

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
    public String register(@RequestBody AppUser appUser) {
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
        appUserRepository.save(appUser);
        return "User registered successfully!";
    }

//    @CrossOrigin(origins = "http://localhost:3000")
//    @PostMapping("/login")
//    public String login(@RequestBody AppUser appUser) {
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(appUser.getUsername(), appUser.getPassword())
//        );
//        return jwtUtils.generateToken(appUser.getUsername());
//    }
}
