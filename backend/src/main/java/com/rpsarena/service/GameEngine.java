package com.rpsarena.service;

import com.rpsarena.model.MatchFormat;
import com.rpsarena.model.Move;
import com.rpsarena.model.Round;
import com.rpsarena.model.RoundResult;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GameEngine {
    public RoundResult resolveRound(Move playerOneMove, Move playerTwoMove) {
        if (playerOneMove == playerTwoMove) {
            return RoundResult.DRAW;
        }
        return playerOneMove.beats(playerTwoMove)
            ? RoundResult.PLAYER_ONE_WIN
            : RoundResult.PLAYER_TWO_WIN;
    }

    public int[] countWins(List<Round> rounds) {
        int playerOneWins = 0;
        int playerTwoWins = 0;
        for (Round round : rounds) {
            if (round.getResult() == RoundResult.PLAYER_ONE_WIN) {
                playerOneWins++;
            } else if (round.getResult() == RoundResult.PLAYER_TWO_WIN) {
                playerTwoWins++;
            }
        }
        return new int[] { playerOneWins, playerTwoWins };
    }

    public Optional<Integer> determineMatchWinner(List<Round> rounds, MatchFormat format) {
        int[] wins = countWins(rounds);
        int winsNeeded = format.winsNeeded();
        if (wins[0] >= winsNeeded) {
            return Optional.of(1);
        }
        if (wins[1] >= winsNeeded) {
            return Optional.of(2);
        }
        return Optional.empty();
    }
}

