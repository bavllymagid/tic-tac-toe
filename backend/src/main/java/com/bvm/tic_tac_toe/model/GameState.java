package com.bvm.tic_tac_toe.model;

import lombok.Data;

import java.util.Arrays;
import java.util.Map;

@Data
public class GameState {
    private String gameId;
    private Board[][] board;
    private String currentPlayer;
    private String winner;
    private boolean isDraw;
    private Player player1;
    private Player player2;
    private GameMove lastMove;
    private int restartCount;
    private Long lastInteractionTime;
    private String mode;

    public GameState() {
        this.winner = null;
        this.isDraw = false;
        this.lastMove = new GameMove();
        this.restartCount = 0;
        this.mode = "classic";
    }

    public void setBoard(Board[][] board) {
        this.board = board;
        for (int i = 0; i < this.board.length; i++) {
            for (int j = 0; j < this.board[i].length; j++) {
                if (board[i][j] == null) {
                    this.board[i][j] = new Board();
                }
            }
        }
    }

}
