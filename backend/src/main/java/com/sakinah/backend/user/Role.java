package com.sakinah.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class Role {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "role_name", nullable = false, unique = true, length = 50)
	private String roleName;

	// ── Constructors ──────────────────────────────
	public Role() {
	}

	public Role(String roleName) {
		this.roleName = roleName;
	}

	// ── Getters ───────────────────────────────────
	public Integer getId() {
		return id;
	}

	public String getRoleName() {
		return roleName;
	}

	// ── Setters ───────────────────────────────────
	public void setId(Integer id) {
		this.id = id;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	// ── toString ──────────────────────────────────
	@Override
	public String toString() {
		return "Role{id=" + id + ", roleName='" + roleName + "'}";
	}
}