package com.rpsarena.dto;

import com.rpsarena.model.Move;
import jakarta.validation.constraints.NotNull;

public record MoveMessage(
    @NotNull(message = "move is required")
    Move move
) {}
