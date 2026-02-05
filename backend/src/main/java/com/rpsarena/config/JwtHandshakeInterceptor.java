package com.rpsarena.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger log = LoggerFactory.getLogger(JwtHandshakeInterceptor.class);
    public static final String PRINCIPAL_KEY = "PRINCIPAL";
    public static final String JWT_KEY = "JWT";
    private final JwtDecoder jwtDecoder;

    public JwtHandshakeInterceptor(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        String token = extractToken(request);
        if (token == null) {
            log.warn("WebSocket connection rejected: missing token");
            return false;
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String subject = jwt.getSubject();
            attributes.put(PRINCIPAL_KEY, subject);
            attributes.put(JWT_KEY, jwt);
            log.debug("WebSocket handshake authenticated for user: {}", subject);
            return true;
        } catch (JwtException e) {
            log.warn("WebSocket connection rejected: invalid token - {}", e.getMessage());
            return false;
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }

    private String extractToken(ServerHttpRequest request) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            return servletRequest.getServletRequest().getParameter("token");
        }
        String query = request.getURI().getQuery();
        if (query == null) {
            return null;
        }
        for (String param : query.split("&")) {
            String[] pair = param.split("=", 2);
            if (pair.length == 2 && "token".equals(pair[0])) {
                return pair[1];
            }
        }
        return null;
    }
}

