package com.sakinah.backend.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sakinah.backend.user.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // ── Constructor injection ─────────────────────
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/register
    // ─────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        MessageResponse response = authService.register(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // ─────────────────────────────────────────────
    // GET /api/auth/verify?token=xxx
    // ─────────────────────────────────────────────
    @GetMapping("/verify")
    public ResponseEntity<MessageResponse> verify(
            @RequestParam String token) {

        MessageResponse response = authService.verifyEmail(token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/login
    // ─────────────────────────────────────────────
   // @PostMapping("/login")
	/*
	 * public ResponseEntity<?> login(
	 * 
	 * @Valid @RequestBody LoginRequest request) {
	 * 
	 * try { AuthResponse response = authService.login(request); return
	 * ResponseEntity.ok(response);
	 * 
	 * } catch (RuntimeException e) { return ResponseEntity
	 * .status(HttpStatus.UNAUTHORIZED)
	 * .body(MessageResponse.error(e.getMessage())); } }
	 */
    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {        // ← add this

        try {
            AuthResponse authResponse = authService.login(request);

            // Set refresh token as httpOnly cookie
            Cookie refreshCookie = new Cookie("refreshToken",
                                               authResponse.getRefreshToken());
            refreshCookie.setHttpOnly(true);      // JS cannot read this
            refreshCookie.setSecure(false);       // true in production (HTTPS)
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(30 * 24 * 60 * 60); // 30 days in seconds
            response.addCookie(refreshCookie);

            // Remove refresh token from JSON body — cookie handles it
            authResponse.setRefreshToken(null);

            return ResponseEntity.ok(authResponse);

        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(MessageResponse.error(e.getMessage()));
        }
    }
    // ─────────────────────────────────────────────
    // POST /api/auth/refresh
    // ─────────────────────────────────────────────
  //  @PostMapping("/refresh")
	/*
	 * public ResponseEntity<?> refresh(
	 * 
	 * @RequestBody RefreshRequest request) {
	 * 
	 * try { AuthResponse response = authService.refresh(request.getRefreshToken());
	 * return ResponseEntity.ok(response);
	 * 
	 * } catch (RuntimeException e) { return ResponseEntity
	 * .status(HttpStatus.UNAUTHORIZED)
	 * .body(MessageResponse.error(e.getMessage())); } }
	 * 
	 */    
    
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,            // ← reads cookie
            HttpServletResponse response) {        // ← sets new cookie

        try {
            // Read refresh token from cookie
            String refreshToken = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }

            if (refreshToken == null) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.error("No refresh token found."));
            }

            AuthResponse authResponse = authService.refresh(refreshToken);

            // Set new refresh cookie (rotation)
            Cookie refreshCookie = new Cookie("refreshToken",
                                               authResponse.getRefreshToken());
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(30 * 24 * 60 * 60);
            response.addCookie(refreshCookie);

            // Don't expose refresh token in body
            authResponse.setRefreshToken(null);

            return ResponseEntity.ok(authResponse);

        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(MessageResponse.error(e.getMessage()));
        }
    }
    
 // ─────────────────────────────────────────────
 // GET /api/auth/me
 // ─────────────────────────────────────────────
 @GetMapping("/me")
 public ResponseEntity<AuthResponse> me(
         @AuthenticationPrincipal User user) {

     return ResponseEntity.ok(authService.me(user));
 }
    
    
    // ─────────────────────────────────────────────
    // POST /api/auth/logout
    // ─────────────────────────────────────────────
//    @PostMapping("/logout")
//    public ResponseEntity<MessageResponse> logout(
//            @RequestBody RefreshRequest request) {
//
//        MessageResponse response = authService.logout(request.getRefreshToken());
//        return ResponseEntity.ok(response);
//    }
 
 
 
 @PostMapping("/logout")
 public ResponseEntity<MessageResponse> logout(
         HttpServletRequest request,
         HttpServletResponse response) {

     // Read refresh token from cookie
     String refreshToken = null;
     if (request.getCookies() != null) {
         for (Cookie cookie : request.getCookies()) {
             if ("refreshToken".equals(cookie.getName())) {
                 refreshToken = cookie.getValue();
                 break;
             }
         }
     }

     if (refreshToken != null) {
         authService.logout(refreshToken);
     }

     // Clear the cookie
     Cookie clearCookie = new Cookie("refreshToken", "");
     clearCookie.setHttpOnly(true);
     clearCookie.setSecure(false);
     clearCookie.setPath("/");
     clearCookie.setMaxAge(0);              // 0 = delete immediately
     response.addCookie(clearCookie);

     return ResponseEntity.ok(MessageResponse.ok("Logged out successfully."));
 }
 
 
}