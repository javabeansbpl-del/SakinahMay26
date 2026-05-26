package com.sakinah.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.access-token-expiry}")
    private long accessTokenExpiry;

    // ── Build the signing key from our secret string ──
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
            secretString.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ── Generate access token ─────────────────────────
    public String generateAccessToken(Integer userId, String email, String roleName) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role",   roleName);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiry))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Validate token — returns true if valid ────────
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Extract email (subject) ───────────────────────
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // ── Extract userId from claims ────────────────────
    public Integer extractUserId(String token) {
        return (Integer) parseClaims(token).get("userId");
    }

    // ── Extract role from claims ──────────────────────
    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    // ── Check expiry ──────────────────────────────────
    public boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    // ── Internal: parse and return claims ────────────
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}