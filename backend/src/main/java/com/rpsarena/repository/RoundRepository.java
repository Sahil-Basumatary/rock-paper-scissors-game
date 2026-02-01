package com.rpsarena.repository;

import com.rpsarena.model.Match;
import com.rpsarena.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RoundRepository extends JpaRepository<Round, UUID> {
    List<Round> findByMatchOrderByRoundNumberAsc(Match match);
    List<Round> findByMatchId(UUID matchId);
}

