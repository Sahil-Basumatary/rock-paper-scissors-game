package com.rpsarena.model;

public enum MatchFormat {
    BO1(1),
    BO3(3),
    BO5(5),
    BO7(7);

    private final int totalRounds;

    MatchFormat(int totalRounds) {
        this.totalRounds = totalRounds;
    }

    public int getTotalRounds() {
        return totalRounds;
    }

    public int winsNeeded() {
        return (totalRounds / 2) + 1;
    }
}

