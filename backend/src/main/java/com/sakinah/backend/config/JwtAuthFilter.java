package com.sakinah.backend.config;

import com.sakinah.backend.user.User;
import com.sakinah.backend.user.UserRepository;
import com.sakinah.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ── Constructor injection (no @Autowired needed in Spring 6+) ──
    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ── Step 1: Read Authorization header ──────────────
        String authHeader = request.getHeader("Authorization");

        // ── Step 2: If no header or not Bearer → skip filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Step 3: Extract the token (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        // ── Step 4: Validate token ──────────────────────────
        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Step 5: Extract email from token ───────────────
        String email = jwtUtil.extractEmail(token);

        // ── Step 6: Only set auth if not already set ───────
        if (email != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

            // ── Step 7: Load user from DB ───────────────────
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null && user.isActive() && user.isVerified()) {

                // ── Step 8: Build authority from role ──────
                String roleName = "ROLE_" + user.getRole().getRoleName();
                List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority(roleName));

                // ── Step 9: Create authentication object ───
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        user,        // principal — the full User object
                        null,        // credentials — null for JWT (no password needed)
                        authorities  // roles
                    );

                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // ── Step 10: Set in SecurityContext ─────────
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // ── Step 11: Continue to next filter / controller ──
        filterChain.doFilter(request, response);
    }
}