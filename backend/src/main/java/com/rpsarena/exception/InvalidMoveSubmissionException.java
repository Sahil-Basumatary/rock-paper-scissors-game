package com.rpsarena.exception;

import java.util.UUID;

public class InvalidMoveSubmissionException extends RuntimeException {
    private final UUID matchId;
    private final UUID playerId;
    public InvalidMoveSubmissionException(UUID matchId, UUID playerId, String reason) {
        super(String.format("Invalid move submission for match %s by player %s: %s", matchId, playerId, reason));
        this.matchId = matchId;
        this.playerId = playerId;
    }
    public UUID getMatchId() {
        return matchId;
    }
    public UUID getPlayerId() {
        return playerId;
    }
}

