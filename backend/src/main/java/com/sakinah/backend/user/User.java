package com.sakinah.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "email", nullable = false, unique = true, length = 100)
	private String email;

	@Column(name = "password_hash", nullable = false, length = 255)
	private String passwordHash;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "role_id")
	private Role role;

	@Column(name = "masjid_id")
	private Integer masjidId;

	@Column(name = "is_active", nullable = false)
	private boolean isActive = true;

	@Column(name = "is_verified", nullable = false)
	private boolean isVerified = false;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	// ── Constructors ──────────────────────────────
	public User() {
	}

	// ── Getters ───────────────────────────────────
	public Integer getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public Role getRole() {
		return role;
	}

	public Integer getMasjidId() {
		return masjidId;
	}

	public boolean isActive() {
		return isActive;
	}

	public boolean isVerified() {
		return isVerified;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	// ── Setters ───────────────────────────────────
	public void setId(Integer id) {
		this.id = id;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public void setMasjidId(Integer masjidId) {
		this.masjidId = masjidId;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public void setVerified(boolean isVerified) {
		this.isVerified = isVerified;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}