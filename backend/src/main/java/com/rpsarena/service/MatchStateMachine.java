package com.rpsarena.service;

import com.rpsarena.exception.InvalidStateTransitionException;
import com.rpsarena.model.Match;
import com.rpsarena.model.MatchState;
import com.rpsarena.model.Player;
import com.rpsarena.model.Round;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Service
public class MatchStateMachine {
    private static final Map<MatchState, Set<MatchState>> VALID_TRANSITIONS;
    static {
        VALID_TRANSITIONS = new EnumMap<>(MatchState.class);
        VALID_TRANSITIONS.put(MatchState.WAITING_FOR_OPPONENT,
            EnumSet.of(MatchState.IN_PROGRESS, MatchState.CANCELLED));
        VALID_TRANSITIONS.put(MatchState.IN_PROGRESS,
            EnumSet.of(MatchState.WAITING_FOR_MOVES));
        VALID_TRANSITIONS.put(MatchState.WAITING_FOR_MOVES,
            EnumSet.of(MatchState.RESOLVING));
        VALID_TRANSITIONS.put(MatchState.RESOLVING,
            EnumSet.of(MatchState.WAITING_FOR_MOVES, MatchState.COMPLETED));
        VALID_TRANSITIONS.put(MatchState.COMPLETED, EnumSet.noneOf(MatchState.class));
        VALID_TRANSITIONS.put(MatchState.CANCELLED, EnumSet.noneOf(MatchState.class));
    }

    public boolean canTransition(Match match, MatchState targetState) {
        MatchState current = match.getState();
        Set<MatchState> allowed = VALID_TRANSITIONS.get(current);
        return allowed != null && allowed.contains(targetState);
    }

    public void transition(Match match, MatchState targetState) {
        if (!canTransition(match, targetState)) {
            throw new InvalidStateTransitionException(match.getState(), targetState);
        }
        match.setState(targetState);
    }

    public void playerJoins(Match match, Player playerTwo) {
        if (match.getState() != MatchState.WAITING_FOR_OPPONENT) {
            throw new InvalidStateTransitionException(
                match.getState(),
                MatchState.IN_PROGRESS,
                "match is not waiting for opponent"
            );
        }
        match.setPlayerTwo(playerTwo);
        match.setState(MatchState.IN_PROGRESS);
        match.setStartedAt(Instant.now());
    }

    public Round startRound(Match match) {
        MatchState current = match.getState();
        if (current != MatchState.IN_PROGRESS && current != MatchState.RESOLVING) {
            throw new InvalidStateTransitionException(
                current,
                MatchState.WAITING_FOR_MOVES,
                "can only start round from IN_PROGRESS or RESOLVING"
            );
        }
        int nextRoundNumber = match.getRounds().size() + 1;
        Round round = Round.create(match, nextRoundNumber);
        match.addRound(round);
        match.setState(MatchState.WAITING_FOR_MOVES);
        return round;
    }

    public void markResolving(Match match) {
        transition(match, MatchState.RESOLVING);
    }

    public void complete(Match match, Player winner) {
        if (match.getState() != MatchState.RESOLVING) {
            throw new InvalidStateTransitionException(
                match.getState(),
                MatchState.COMPLETED,
                "can only complete from RESOLVING state"
            );
        }
        match.setWinner(winner);
        match.setEndedAt(Instant.now());
        match.setState(MatchState.COMPLETED);
    }

    public void cancel(Match match) {
        if (match.getState() != MatchState.WAITING_FOR_OPPONENT) {
            throw new InvalidStateTransitionException(
                match.getState(),
                MatchState.CANCELLED,
                "can only cancel while waiting for opponent"
            );
        }
        match.setEndedAt(Instant.now());
        match.setState(MatchState.CANCELLED);
    }
}
