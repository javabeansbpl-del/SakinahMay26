
package com.sakinah.backend.auth;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String email;
    private String role;
    private String firstName;
    private String lastName;

    // ── Constructors ──────────────────────────────
    public AuthResponse() {}

    public AuthResponse(String accessToken,
                        String refreshToken,
                        String email,
                        String role,
                        String firstName,
                        String lastName) {
        this.accessToken  = accessToken;
        this.refreshToken = refreshToken;
        this.email        = email;
        this.role         = role;
        this.firstName    = firstName;
        this.lastName     = lastName;
    }

    // ── Getters ───────────────────────────────────
    public String getAccessToken()  { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getTokenType()    { return tokenType; }
    public String getEmail()        { return email; }
    public String getRole()         { return role; }
    public String getFirstName()    { return firstName; }
    public String getLastName()     { return lastName; }

    // ── Setters ───────────────────────────────────
    public void setAccessToken(String accessToken)   { this.accessToken = accessToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void setTokenType(String tokenType)       { this.tokenType = tokenType; }
    public void setEmail(String email)               { this.email = email; }
    public void setRole(String role)                 { this.role = role; }
    public void setFirstName(String firstName)       { this.firstName = firstName; }
    public void setLastName(String lastName)         { this.lastName = lastName; }
}