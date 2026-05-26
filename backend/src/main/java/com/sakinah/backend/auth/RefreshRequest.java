package com.sakinah.backend.auth;

public class RefreshRequest {

    private String refreshToken;

    // ── Constructors ──────────────────────────────
    public RefreshRequest() {}

    // ── Getters ───────────────────────────────────
    public String getRefreshToken() { return refreshToken; }

    // ── Setters ───────────────────────────────────
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}