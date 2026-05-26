package com.sakinah.backend.auth;

import com.sakinah.backend.token.RefreshToken;
import com.sakinah.backend.token.RefreshTokenRepository;
import com.sakinah.backend.token.VerificationToken;
import com.sakinah.backend.token.VerificationTokenRepository;
import com.sakinah.backend.user.Role;
import com.sakinah.backend.user.RoleRepository;
import com.sakinah.backend.user.User;
import com.sakinah.backend.user.UserProfile;
import com.sakinah.backend.user.UserProfileRepository;
import com.sakinah.backend.user.UserRepository;
import com.sakinah.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository            userRepository;
    private final UserProfileRepository     userProfileRepository;
    private final RoleRepository            roleRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder           passwordEncoder;
    private final JwtUtil                   jwtUtil;
    private final AuthenticationManager     authenticationManager;
    private final JavaMailSender            mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.verify-email-path}")
    private String verifyPath;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    // ── Constructor ───────────────────────────────
    public AuthService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       VerificationTokenRepository verificationTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       JavaMailSender mailSender) {

        this.userRepository              = userRepository;
        this.userProfileRepository       = userProfileRepository;
        this.roleRepository              = roleRepository;
        this.refreshTokenRepository      = refreshTokenRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordEncoder             = passwordEncoder;
        this.jwtUtil                     = jwtUtil;
        this.authenticationManager       = authenticationManager;
        this.mailSender                  = mailSender;
    }

    // ─────────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────────
    @Transactional
    public MessageResponse register(RegisterRequest request) {

        // 1. Check email not already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            return MessageResponse.error("Email is already registered.");
        }

        // 2. Load USER role from DB
        Role userRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() ->
                    new RuntimeException("Role USER not found. Please seed the roles table."));

        // 3. Build and save user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setActive(true);
        user.setVerified(false);  // not verified yet
        User savedUser = userRepository.save(user);

        // 4. Build and save profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        userProfileRepository.save(profile);

        // 5. Generate verification token and send email
        sendVerificationEmail(savedUser);

        return MessageResponse.ok(
            "Registration successful. Please check your email to verify your account.");
    }

    // ─────────────────────────────────────────────
    // VERIFY EMAIL
    // ─────────────────────────────────────────────
    @Transactional
    public MessageResponse verifyEmail(String token) {

        // 1. Find token in DB
        Optional<VerificationToken> optional =
            verificationTokenRepository.findByToken(token);

        if (optional.isEmpty()) {
            return MessageResponse.error("Invalid verification link.");
        }

        VerificationToken verificationToken = optional.get();

        // 2. Check not already used
        if (verificationToken.isUsed()) {
            return MessageResponse.error("This link has already been used.");
        }

        // 3. Check not expired
        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return MessageResponse.error("Verification link has expired. Please register again.");
        }

        // 4. Mark user as verified
        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);

        // 5. Mark token as used
        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        return MessageResponse.ok("Email verified successfully. You can now login.");
    }

    // ─────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest request) {

        // 1. Authenticate — throws exception if wrong credentials
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // 2. Load user from DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new RuntimeException("User not found."));

        // 3. Check verified
        if (!user.isVerified()) {
            throw new RuntimeException(
                "Email not verified. Please check your inbox.");
        }

        // 4. Check active
        if (!user.isActive()) {
            throw new RuntimeException(
                "Account is deactivated. Please contact support.");
        }

        // 5. Load profile for name
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElse(null);

        String firstName = profile != null ? profile.getFirstName() : "";
        String lastName  = profile != null ? profile.getLastName()  : "";

        // 6. Generate access token
        String accessToken = jwtUtil.generateAccessToken(
            user.getId(),
            user.getEmail(),
            user.getRole().getRoleName()
        );

        // 7. Generate refresh token — raw UUID + BCrypt hash stored
        String rawRefreshToken = UUID.randomUUID().toString();
        saveRefreshToken(user, rawRefreshToken);

        // 8. Return response
        return new AuthResponse(
            accessToken,
            rawRefreshToken,
            user.getEmail(),
            user.getRole().getRoleName(),
            firstName,
            lastName
        );
    }

    // ─────────────────────────────────────────────
    // REFRESH TOKEN
    // ─────────────────────────────────────────────
    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {

        // 1. Find all non-revoked tokens and match via BCrypt
        RefreshToken matched = refreshTokenRepository
            .findAll()
            .stream()
            .filter(rt -> !rt.isRevoked()
                && rt.getExpiresAt().isAfter(LocalDateTime.now())
                && passwordEncoder.matches(rawRefreshToken, rt.getTokenHash()))
            .findFirst()
            .orElseThrow(() ->
                new RuntimeException("Invalid or expired refresh token."));

        // 2. Get user
        User user = matched.getUser();

        // 3. Revoke old refresh token
        matched.setRevoked(true);
        refreshTokenRepository.save(matched);

        // 4. Issue new access token
        String newAccessToken = jwtUtil.generateAccessToken(
            user.getId(),
            user.getEmail(),
            user.getRole().getRoleName()
        );

        // 5. Issue new refresh token (rotation)
        String newRawRefreshToken = UUID.randomUUID().toString();
        saveRefreshToken(user, newRawRefreshToken);

        // 6. Load profile
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElse(null);

        String firstName = profile != null ? profile.getFirstName() : "";
        String lastName  = profile != null ? profile.getLastName()  : "";

        return new AuthResponse(
            newAccessToken,
            newRawRefreshToken,
            user.getEmail(),
            user.getRole().getRoleName(),
            firstName,
            lastName
        );
    }

    // ─────────────────────────────────────────────
    // LOGOUT
    // ─────────────────────────────────────────────
    @Transactional
    public MessageResponse logout(String rawRefreshToken) {

        // Find matching token and revoke it
        refreshTokenRepository.findAll()
            .stream()
            .filter(rt -> !rt.isRevoked()
                && passwordEncoder.matches(rawRefreshToken, rt.getTokenHash()))
            .findFirst()
            .ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });

        return MessageResponse.ok("Logged out successfully.");
    }

    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────

    private void saveRefreshToken(User user, String rawToken) {
        // Revoke any existing tokens for this user first
        refreshTokenRepository.revokeAllByUser(user);

        // Save new hashed token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(passwordEncoder.encode(rawToken));
        refreshToken.setExpiresAt(
            LocalDateTime.now().plusSeconds(refreshTokenExpiry / 1000)
        );
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);
    }

    private void sendVerificationEmail(User user) {
        // Generate unique token
        String token = UUID.randomUUID().toString();

        // Save to DB
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setUser(user);
        verificationToken.setToken(token);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        verificationToken.setUsed(false);
        verificationTokenRepository.save(verificationToken);

        // Build verification link
        String link = baseUrl + verifyPath + "?token=" + token;

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Sakinah — Verify Your Email");
        message.setText(
            "As-salamu alaykum,\n\n" +
            "Thank you for registering with Sakinah.\n\n" +
            "Please verify your email by clicking the link below:\n" +
            link + "\n\n" +
            "This link expires in 24 hours.\n\n" +
            "If you did not register, please ignore this email.\n\n" +
            "JazakAllahu Khayran,\n" +
            "The Sakinah Team"
        );
        mailSender.send(message);
    }
    
 // ─────────────────────────────────────────────
 // GET CURRENT USER
 // ─────────────────────────────────────────────
 public AuthResponse me(User user) {

     UserProfile profile = userProfileRepository.findByUser(user)
             .orElse(null);

     String firstName = profile != null ? profile.getFirstName() : "";
     String lastName  = profile != null ? profile.getLastName()  : "";

     return new AuthResponse(
         null,   // no new token — client already has it
         null,
         user.getEmail(),
         user.getRole().getRoleName(),
         firstName,
         lastName
     );
 }
    
    
    
    
}