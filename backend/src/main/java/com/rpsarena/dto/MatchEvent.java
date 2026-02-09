package com.rpsarena.dto;

import java.util.UUID;

public record MatchEvent(
    EventType type,
    Object payload
) {
    public enum EventType {
        PLAYER_JOINED,
        MOVE_RECEIVED,
        ROUND_COMPLETE,
        MATCH_COMPLETE
    }
    public static MatchEvent playerJoined(MatchResponse match) {
        return new MatchEvent(EventType.PLAYER_JOINED, match);
    }
    public static MatchEvent moveReceived(UUID playerId) {
        return new MatchEvent(EventType.MOVE_RECEIVED, playerId);
    }
    public static MatchEvent roundComplete(MatchResponse match) {
        return new MatchEvent(EventType.ROUND_COMPLETE, match);
    }
    public static MatchEvent matchComplete(MatchResponse match) {
        return new MatchEvent(EventType.MATCH_COMPLETE, match);
    }
}
