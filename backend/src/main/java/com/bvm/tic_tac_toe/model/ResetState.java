package com.bvm.tic_tac_toe.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetState {
    private String gameId;
    private String playerId;
    private Boolean reset;
}
