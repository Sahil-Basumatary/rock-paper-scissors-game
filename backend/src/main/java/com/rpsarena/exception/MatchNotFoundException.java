package com.rpsarena.exception;

import java.util.UUID;

public class MatchNotFoundException extends RuntimeException {
    private final UUID matchId;
    public MatchNotFoundException(UUID matchId) {
        super(String.format("Match not found: %s", matchId));
        this.matchId = matchId;
    }
    public UUID getMatchId() {
        return matchId;
    }
}

