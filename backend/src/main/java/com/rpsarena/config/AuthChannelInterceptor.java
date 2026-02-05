package com.rpsarena.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() != StompCommand.CONNECT) {
            return message;
        }
        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        if (sessionAttributes == null) {
            return message;
        }
        Jwt jwt = (Jwt) sessionAttributes.get(JwtHandshakeInterceptor.JWT_KEY);
        String principal = (String) sessionAttributes.get(JwtHandshakeInterceptor.PRINCIPAL_KEY);
        if (jwt != null && principal != null) {
            JwtAuthenticationToken authentication = new JwtAuthenticationToken(
                    jwt,
                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
            accessor.setUser(authentication);
        }
        return message;
    }
}

