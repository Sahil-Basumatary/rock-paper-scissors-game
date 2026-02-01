package com.rpsarena.dto;

import com.rpsarena.model.Match;
import com.rpsarena.model.MatchFormat;
import com.rpsarena.model.MatchState;
import com.rpsarena.model.MatchType;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MatchResponse(
    UUID id,
    UUID playerOneId,
    String playerOneUsername,
    UUID playerTwoId,
    String playerTwoUsername,
    MatchState state,
    MatchFormat format,
    MatchType type,
    UUID winnerId,
    List<RoundResponse> rounds,
    int playerOneWins,
    int playerTwoWins,
    Instant createdAt,
    Instant startedAt,
    Instant endedAt
) {
    public static MatchResponse from(Match match, int playerOneWins, int playerTwoWins) {
        return new MatchResponse(
            match.getId(),
            match.getPlayerOne() != null ? match.getPlayerOne().getId() : null,
            match.getPlayerOne() != null ? match.getPlayerOne().getUsername() : null,
            match.getPlayerTwo() != null ? match.getPlayerTwo().getId() : null,
            match.getPlayerTwo() != null ? match.getPlayerTwo().getUsername() : null,
            match.getState(),
            match.getFormat(),
            match.getType(),
            match.getWinner() != null ? match.getWinner().getId() : null,
            match.getRounds().stream().map(RoundResponse::from).toList(),
            playerOneWins,
            playerTwoWins,
            match.getCreatedAt(),
            match.getStartedAt(),
            match.getEndedAt()
        );
    }
}

