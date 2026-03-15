package com.rpsarena.ai;

import com.rpsarena.model.Move;
import java.util.List;

public interface AiStrategy {
    Move selectMove(List<Move> opponentHistory);
    String getName();
    AiDifficulty getDifficulty();
}
