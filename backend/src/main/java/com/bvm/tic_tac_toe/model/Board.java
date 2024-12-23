package com.bvm.tic_tac_toe.model;

import lombok.Data;

@Data
public class Board {
    private String[][] grid;
    private String winner;
    private boolean isComplete;

    public Board() {
        this.grid = new String[3][3];
        this.winner = null;
        this.isComplete = false;
    }
}
