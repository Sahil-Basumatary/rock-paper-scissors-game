package com.rpsarena.service;

import com.rpsarena.exception.InvalidStateTransitionException;
import com.rpsarena.model.Match;
import com.rpsarena.model.MatchState;
import org.springframework.stereotype.Service;
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
}
