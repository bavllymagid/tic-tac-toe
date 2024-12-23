package com.bvm.tic_tac_toe.model;

import lombok.Data;

@Data
public class GameMove {
    private int outerRow;
    private int outerCol;
    private int innerRow;
    private int innerCol;
}
