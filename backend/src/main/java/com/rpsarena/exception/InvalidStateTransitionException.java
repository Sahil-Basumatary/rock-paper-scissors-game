package com.rpsarena.exception;

import com.rpsarena.model.MatchState;

public class InvalidStateTransitionException extends RuntimeException {
    private final MatchState currentState;
    private final MatchState attemptedState;

    public InvalidStateTransitionException(MatchState currentState, MatchState attemptedState) {
        super(String.format("Cannot transition from %s to %s", currentState, attemptedState));
        this.currentState = currentState;
        this.attemptedState = attemptedState;
    }

    public InvalidStateTransitionException(MatchState currentState, MatchState attemptedState, String reason) {
        super(String.format("Cannot transition from %s to %s: %s", currentState, attemptedState, reason));
        this.currentState = currentState;
        this.attemptedState = attemptedState;
    }

    public MatchState getCurrentState() {
        return currentState;
    }

    public MatchState getAttemptedState() {
        return attemptedState;
    }
}

