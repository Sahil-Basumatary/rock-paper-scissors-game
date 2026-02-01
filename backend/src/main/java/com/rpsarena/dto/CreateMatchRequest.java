package com.rpsarena.dto;

import com.rpsarena.model.MatchFormat;
import com.rpsarena.model.MatchType;
import jakarta.validation.constraints.NotNull;

public record CreateMatchRequest(
    @NotNull(message = "format is required")
    MatchFormat format,
    @NotNull(message = "type is required")
    MatchType type
) {}

