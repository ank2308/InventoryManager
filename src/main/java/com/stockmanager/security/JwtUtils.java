package com.stockmanager.security;


import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {private final String SECRET_KEY = "your-secret-key";

    // Extract username from the token
    public String getUsernameFromToken(String token) {
        return extractClaims(token).getSubject();
    }

    // Validate the token
    public boolean validateToken(String token, String username) {
        final String extractedUsername = getUsernameFromToken(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    // Generate a new token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Check if the token is expired
    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // Extract claims from the token
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

}
