package com.bvm.tic_tac_toe.model;

import lombok.Data;

@Data
public class GameMove {
    private int outerRow;
    private int outerCol;
    private int innerRow;
    private int innerCol;

    public GameMove() {
        this.outerRow = -1;
        this.outerCol = -1;
        this.innerRow = -1;
        this.innerCol = -1;
    }
}
