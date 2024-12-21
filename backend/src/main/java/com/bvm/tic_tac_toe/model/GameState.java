package com.bvm.tic_tac_toe.model;

import lombok.Data;

import java.util.Arrays;

@Data
public class GameState {
    private String gameId;
    private String[][] board;
    private String currentPlayer;
    private String winner;
    private boolean isDraw;
    private Player player1;
    private Player player2;
    private Long lastMove;
    private int restartCount;

    public GameState() {
        this.board = new String[3][3];
        this.winner = "";
        this.isDraw = false;
        this.lastMove = System.currentTimeMillis();
        this.restartCount = 0;
    }

    public String toString() {
        return "GameState{" +
                "gameId='" + gameId + '\'' +
                ", board=" + Arrays.deepToString(board) +
                ", currentPlayer='" + currentPlayer + '\'' +
                ", winner='" + winner + '\'' +
                ", isDraw=" + isDraw +
                ", player1=" + player1 +
                ", player2=" + player2 +
                ", lastMove=" + lastMove +
                ", restartCount=" + restartCount +
                '}';
    }
}
