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
@Table(name = "matches")
public class Match {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_one_id")
    private Player playerOne;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_two_id")
    private Player playerTwo;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MatchState state;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MatchFormat format;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MatchType type;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private Player winner;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @Column(name = "started_at")
    private Instant startedAt;
    @Column(name = "ended_at")
    private Instant endedAt;

    protected Match() {}

    private Match(UUID id, Player playerOne, MatchFormat format, MatchType type) {
        this.id = id;
        this.playerOne = playerOne;
        this.format = format;
        this.type = type;
        this.state = MatchState.WAITING_FOR_OPPONENT;
    }

    public static Match create(Player playerOne, MatchFormat format, MatchType type) {
        return new Match(UUID.randomUUID(), playerOne, format, type);
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

    public Player getPlayerOne() {
        return playerOne;
    }

    public Player getPlayerTwo() {
        return playerTwo;
    }

    public void setPlayerTwo(Player playerTwo) {
        this.playerTwo = playerTwo;
    }

    public MatchState getState() {
        return state;
    }

    public void setState(MatchState state) {
        this.state = state;
    }

    public MatchFormat getFormat() {
        return format;
    }

    public MatchType getType() {
        return type;
    }

    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
    }
}

