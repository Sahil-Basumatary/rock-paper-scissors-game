package com.rpsarena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rounds")
public class Round {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;
    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;
    @Enumerated(EnumType.STRING)
    @Column(name = "player_one_move", length = 10)
    private Move playerOneMove;
    @Enumerated(EnumType.STRING)
    @Column(name = "player_two_move", length = 10)
    private Move playerTwoMove;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoundResult result;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Round() {}

    private Round(UUID id, Match match, Integer roundNumber) {
        this.id = id;
        this.match = match;
        this.roundNumber = roundNumber;
    }

    public static Round create(Match match, Integer roundNumber) {
        return new Round(UUID.randomUUID(), match, roundNumber);
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

    public Match getMatch() {
        return match;
    }

    void setMatch(Match match) {
        this.match = match;
    }

    public Integer getRoundNumber() {
        return roundNumber;
    }

    public Move getPlayerOneMove() {
        return playerOneMove;
    }

    public void setPlayerOneMove(Move playerOneMove) {
        this.playerOneMove = playerOneMove;
    }

    public Move getPlayerTwoMove() {
        return playerTwoMove;
    }

    public void setPlayerTwoMove(Move playerTwoMove) {
        this.playerTwoMove = playerTwoMove;
    }

    public RoundResult getResult() {
        return result;
    }

    public void setResult(RoundResult result) {
        this.result = result;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean hasBothMoves() {
        return playerOneMove != null && playerTwoMove != null;
    }
}

