package com.rpsarena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "players")
public class Player {
    @Id
    private UUID id;
    @Column(name = "clerk_id", nullable = false, unique = true)
    private String clerkId;
    @Column(nullable = false, length = 50)
    private String username;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Player() {}

    private Player(UUID id, String clerkId, String username) {
        this.id = id;
        this.clerkId = clerkId;
        this.username = username;
    }

    public static Player create(String clerkId, String username) {
        return new Player(UUID.randomUUID(), clerkId, username);
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getClerkId() {
        return clerkId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

