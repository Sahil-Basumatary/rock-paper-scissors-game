package com.rpsarena.service;

import com.rpsarena.dto.CreateMatchRequest;
import com.rpsarena.dto.MatchResponse;
import com.rpsarena.dto.SubmitMoveRequest;
import com.rpsarena.exception.InvalidMoveSubmissionException;
import com.rpsarena.exception.MatchNotFoundException;
import com.rpsarena.exception.PlayerNotFoundException;
import com.rpsarena.model.Match;
import com.rpsarena.model.MatchState;
import com.rpsarena.model.MatchType;
import com.rpsarena.model.Player;
import com.rpsarena.model.Round;
import com.rpsarena.model.RoundResult;
import com.rpsarena.repository.MatchRepository;
import com.rpsarena.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final GameEngine gameEngine;
    private final MatchStateMachine stateMachine;
    public MatchService(MatchRepository matchRepository,
                        PlayerRepository playerRepository,
                        GameEngine gameEngine,
                        MatchStateMachine stateMachine) {
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.gameEngine = gameEngine;
        this.stateMachine = stateMachine;
    }
    @Transactional
    public MatchResponse createMatch(UUID playerId, CreateMatchRequest request) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new PlayerNotFoundException(playerId));
        Match match = Match.create(player, request.format(), request.type());
        matchRepository.save(match);
        return toResponse(match);
    }
    @Transactional
    public MatchResponse joinMatch(UUID matchId, UUID playerId) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new MatchNotFoundException(matchId));
        Player playerTwo = playerRepository.findById(playerId)
            .orElseThrow(() -> new PlayerNotFoundException(playerId));
        if (match.getPlayerOne().getId().equals(playerId)) {
            throw new InvalidMoveSubmissionException(matchId, playerId, "cannot join your own match");
        }
        stateMachine.playerJoins(match, playerTwo);
        stateMachine.startRound(match);
        matchRepository.save(match);
        return toResponse(match);
    }
    @Transactional(readOnly = true)
    public MatchResponse getMatch(UUID matchId) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new MatchNotFoundException(matchId));
        return toResponse(match);
    }
    @Transactional
    public MatchResponse submitMove(UUID matchId, UUID playerId, SubmitMoveRequest request) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new MatchNotFoundException(matchId));
        validatePlayerInMatch(match, playerId);
        if (match.getState() != MatchState.WAITING_FOR_MOVES) {
            throw new InvalidMoveSubmissionException(matchId, playerId, "match is not accepting moves");
        }
        Round currentRound = getCurrentRound(match);
        boolean isPlayerOne = match.getPlayerOne().getId().equals(playerId);
        if (isPlayerOne) {
            if (currentRound.getPlayerOneMove() != null) {
                throw new InvalidMoveSubmissionException(matchId, playerId, "move already submitted");
            }
            currentRound.setPlayerOneMove(request.move());
        } else {
            if (currentRound.getPlayerTwoMove() != null) {
                throw new InvalidMoveSubmissionException(matchId, playerId, "move already submitted");
            }
            currentRound.setPlayerTwoMove(request.move());
        }
        if (currentRound.hasBothMoves()) {
            resolveRound(match, currentRound);
        }
        matchRepository.save(match);
        return toResponse(match);
    }
    @Transactional(readOnly = true)
    public List<MatchResponse> getPlayerMatches(UUID playerId) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new PlayerNotFoundException(playerId));
        return matchRepository.findByPlayerOneOrPlayerTwo(player, player)
            .stream()
            .map(this::toResponse)
            .toList();
    }
    @Transactional(readOnly = true)
    public List<MatchResponse> findAvailableMatches(MatchType type) {
        return matchRepository.findByStateAndType(MatchState.WAITING_FOR_OPPONENT, type)
            .stream()
            .map(this::toResponse)
            .toList();
    }
    @Transactional
    public MatchResponse cancelMatch(UUID matchId, UUID playerId) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new MatchNotFoundException(matchId));
        if (!match.getPlayerOne().getId().equals(playerId)) {
            throw new InvalidMoveSubmissionException(matchId, playerId, "only match creator can cancel");
        }
        stateMachine.cancel(match);
        matchRepository.save(match);
        return toResponse(match);
    }
    private void validatePlayerInMatch(Match match, UUID playerId) {
        boolean isPlayerOne = match.getPlayerOne() != null && match.getPlayerOne().getId().equals(playerId);
        boolean isPlayerTwo = match.getPlayerTwo() != null && match.getPlayerTwo().getId().equals(playerId);
        if (!isPlayerOne && !isPlayerTwo) {
            throw new InvalidMoveSubmissionException(match.getId(), playerId, "player is not in this match");
        }
    }
    private Round getCurrentRound(Match match) {
        List<Round> rounds = match.getRounds();
        if (rounds.isEmpty()) {
            throw new IllegalStateException("No rounds in match");
        }
        return rounds.get(rounds.size() - 1);
    }
    private void resolveRound(Match match, Round round) {
        RoundResult result = gameEngine.resolveRound(round.getPlayerOneMove(), round.getPlayerTwoMove());
        round.setResult(result);
        stateMachine.markResolving(match);
        Optional<Integer> winnerNum = gameEngine.determineMatchWinner(match.getRounds(), match.getFormat());
        if (winnerNum.isPresent()) {
            Player winner = winnerNum.get() == 1 ? match.getPlayerOne() : match.getPlayerTwo();
            stateMachine.complete(match, winner);
        } else {
            stateMachine.startRound(match);
        }
    }
    private MatchResponse toResponse(Match match) {
        int[] wins = gameEngine.countWins(match.getRounds());
        return MatchResponse.from(match, wins[0], wins[1]);
    }
}

