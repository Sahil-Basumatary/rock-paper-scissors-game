package com.rpsarena.controller;

import com.rpsarena.dto.MatchEvent;
import com.rpsarena.dto.MatchResponse;
import com.rpsarena.dto.MoveMessage;
import com.rpsarena.dto.RoundResponse;
import com.rpsarena.dto.SubmitMoveRequest;
import com.rpsarena.exception.InvalidMoveSubmissionException;
import com.rpsarena.exception.InvalidStateTransitionException;
import com.rpsarena.exception.MatchNotFoundException;
import com.rpsarena.exception.PlayerNotFoundException;
import com.rpsarena.model.MatchState;
import com.rpsarena.repository.PlayerRepository;
import com.rpsarena.service.MatchService;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Controller
public class MatchWebSocketController {
    private final MatchService matchService;
    private final PlayerRepository playerRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MatchWebSocketController(
            MatchService matchService,
            PlayerRepository playerRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.matchService = matchService;
        this.playerRepository = playerRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/match/{matchId}/join")
    public void handleJoin(UUID matchId, Principal principal) {
        UUID playerId = resolvePlayerId(principal);
        MatchResponse response = matchService.joinMatch(matchId, playerId);
        broadcast(matchId, MatchEvent.playerJoined(response));
    }

    @MessageMapping("/match/{matchId}/move")
    public void handleMove(UUID matchId, @Payload MoveMessage moveMessage, Principal principal) {
        UUID playerId = resolvePlayerId(principal);
        SubmitMoveRequest request = new SubmitMoveRequest(moveMessage.move());
        MatchResponse response = matchService.submitMove(matchId, playerId, request);

        broadcast(matchId, MatchEvent.moveReceived(playerId));

        if (response.state() == MatchState.COMPLETED) {
            broadcast(matchId, MatchEvent.matchComplete(response));
        } else if (roundJustResolved(response.rounds())) {
            broadcast(matchId, MatchEvent.roundComplete(response));
        }
    }

    @MessageExceptionHandler({
        MatchNotFoundException.class,
        InvalidMoveSubmissionException.class,
        PlayerNotFoundException.class,
        InvalidStateTransitionException.class
    })
    public void handleDomainException(Exception ex, Message<?> message) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        Principal principal = accessor.getUser();
        if (principal != null) {
            messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", ex.getMessage());
        }
    }

    private UUID resolvePlayerId(Principal principal) {
        String clerkId = principal != null ? principal.getName() : null;
        if (clerkId == null) {
            throw new PlayerNotFoundException("anonymous");
        }
        return playerRepository.findByClerkId(clerkId)
                .map(p -> p.getId())
                .orElseThrow(() -> new PlayerNotFoundException(clerkId));
    }

    private void broadcast(UUID matchId, MatchEvent event) {
        messagingTemplate.convertAndSend("/topic/match/" + matchId, event);
    }

    private boolean roundJustResolved(List<RoundResponse> rounds) {
        if (rounds == null || rounds.size() < 2) {
            return false;
        }
        RoundResponse latest = rounds.get(rounds.size() - 1);
        return latest.playerOneMove() == null && latest.playerTwoMove() == null;
    }
}
