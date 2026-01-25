package com.rpsarena.model;

import java.util.EnumMap;

public enum Move {
    ROCK, PAPER, SCISSORS;

    private static final EnumMap<Move, Move> BEATS = new EnumMap<>(Move.class);

    static {
        BEATS.put(ROCK, SCISSORS);
        BEATS.put(SCISSORS, PAPER);
        BEATS.put(PAPER, ROCK);
    }

    public boolean beats(Move other) {
        return BEATS.get(this) == other;
    }
}

