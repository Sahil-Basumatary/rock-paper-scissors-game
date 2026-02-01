package com.rpsarena.repository;

import com.rpsarena.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    Optional<Player> findByClerkId(String clerkId);
    Optional<Player> findByUsername(String username);
    boolean existsByClerkId(String clerkId);
}

