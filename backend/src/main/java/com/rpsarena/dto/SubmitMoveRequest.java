package com.rpsarena.dto;

import com.rpsarena.model.Move;
import jakarta.validation.constraints.NotNull;

public record SubmitMoveRequest(
    @NotNull(message = "move is required")
    Move move
) {}

