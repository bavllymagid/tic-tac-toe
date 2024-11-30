package com.bvm.tik_tak_toe.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Data
public class GameState {
    private String gameId;
    private String[][] board;
    private String currentPlayer;
    private String winner;
    private boolean isDraw;
    private List<String> players;

    public GameState() {
        this.board = new String[3][3];
        this.currentPlayer = new Random().nextBoolean() ? "X" : "O";
        this.winner = null;
        this.isDraw = false;
        this.players = new ArrayList<>();
    }

    public boolean makeMove(int row, int col) {
        if (board[row][col] == null && winner == null) {
            board[row][col] = currentPlayer;
            checkGameStatus();
            currentPlayer = currentPlayer.equals("X") ? "O" : "X";
            return true;
        }
        return false;
    }

    private void checkGameStatus() {
        //check rows, columns
        for (int i = 0; i < 3; i++) {
            if (board[i][0] != null && board[i][0].equals(board[i][1]) && board[i][0].equals(board[i][2])) {
                winner = board[i][0];
                return;
            }
            if (board[0][i] != null && board[0][i].equals(board[1][i]) && board[0][i].equals(board[2][i])) {
                winner = board[0][i];
                return;
            }
        }

        //check diagonals
        if (board[0][0] != null && board[0][0].equals(board[1][1]) && board[0][0].equals(board[2][2])) {
            winner = board[0][0];
        }
        else if (board[0][2] != null && board[0][2].equals(board[1][1]) && board[0][2].equals(board[2][0])) {
            winner = board[0][2];
        }
        else {
            isDraw = true;
        }
    }
}
