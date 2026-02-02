package com.rpsarena.exception;

import java.util.UUID;

public class PlayerNotFoundException extends RuntimeException {
    private final UUID playerId;
    public PlayerNotFoundException(UUID playerId) {
        super(String.format("Player not found: %s", playerId));
        this.playerId = playerId;
    }
    public PlayerNotFoundException(String clerkId) {
        super(String.format("Player not found with clerkId: %s", clerkId));
        this.playerId = null;
    }
    public UUID getPlayerId() {
        return playerId;
    }
}

