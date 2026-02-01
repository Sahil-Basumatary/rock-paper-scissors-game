package com.rpsarena.repository;

import com.rpsarena.model.Match;
import com.rpsarena.model.MatchState;
import com.rpsarena.model.MatchType;
import com.rpsarena.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MatchRepository extends JpaRepository<Match, UUID> {
    List<Match> findByState(MatchState state);
    List<Match> findByStateAndType(MatchState state, MatchType type);
    List<Match> findByPlayerOneOrPlayerTwo(Player playerOne, Player playerTwo);
    Optional<Match> findFirstByStateAndTypeOrderByCreatedAtAsc(MatchState state, MatchType type);
}

