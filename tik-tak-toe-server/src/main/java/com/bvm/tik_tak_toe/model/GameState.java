package com.bvm.tik_tak_toe.model;

import lombok.Data;

@Data
public class GameState {
    private String gameId;
    private String[][] board;
    private String currentPlayer;
    private String winner;
    private boolean isDraw;
    private String player1;
    private String player2;

    public GameState() {
        this.board = new String[3][3];
        this.winner = "";
        this.isDraw = false;
    }
}
