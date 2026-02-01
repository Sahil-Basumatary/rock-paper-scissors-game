package com.rpsarena.dto;

import com.rpsarena.model.Move;
import com.rpsarena.model.Round;
import com.rpsarena.model.RoundResult;
import java.time.Instant;
import java.util.UUID;

public record RoundResponse(
    UUID id,
    int roundNumber,
    Move playerOneMove,
    Move playerTwoMove,
    RoundResult result,
    Instant createdAt
) {
    public static RoundResponse from(Round round) {
        return new RoundResponse(
            round.getId(),
            round.getRoundNumber(),
            round.getPlayerOneMove(),
            round.getPlayerTwoMove(),
            round.getResult(),
            round.getCreatedAt()
        );
    }
}

