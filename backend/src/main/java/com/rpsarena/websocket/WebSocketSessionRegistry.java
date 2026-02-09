package com.rpsarena.websocket;

import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketSessionRegistry {
    private final ConcurrentHashMap<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    public void registerSession(String clerkId, String sessionId) {
        userSessions.compute(clerkId, (key, sessions) -> {
            if (sessions == null) {
                sessions = ConcurrentHashMap.newKeySet();
            }
            sessions.add(sessionId);
            return sessions;
        });
    }

    public void unregisterSession(String clerkId, String sessionId) {
        userSessions.computeIfPresent(clerkId, (key, sessions) -> {
            sessions.remove(sessionId);
            return sessions.isEmpty() ? null : sessions;
        });
    }

    public boolean isUserOnline(String clerkId) {
        Set<String> sessions = userSessions.get(clerkId);
        return sessions != null && !sessions.isEmpty();
    }

    public Set<String> getSessionIds(String clerkId) {
        Set<String> sessions = userSessions.get(clerkId);
        return sessions != null ? Collections.unmodifiableSet(sessions) : Collections.emptySet();
    }

    public int getOnlineUserCount() {
        return userSessions.size();
    }
}
