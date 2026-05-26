
package com.sakinah.backend.auth;

public class MessageResponse {

    private String message;
    private boolean success;

    // ── Constructors ──────────────────────────────
    public MessageResponse() {}

    public MessageResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    // ── Static factory methods — clean to use ─────
    public static MessageResponse ok(String message) {
        return new MessageResponse(message, true);
    }

    public static MessageResponse error(String message) {
        return new MessageResponse(message, false);
    }

    // ── Getters ───────────────────────────────────
    public String getMessage()  { return message; }
    public boolean isSuccess()  { return success; }

    // ── Setters ───────────────────────────────────
    public void setMessage(String message) { this.message = message; }
    public void setSuccess(boolean success) { this.success = success; }
}