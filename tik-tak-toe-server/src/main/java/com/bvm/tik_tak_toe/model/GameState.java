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
        populateGrid();
        this.winner = "";
        this.isDraw = false;
    }

    public boolean makeMove(int col, int row) {
        if (board[row][col].isEmpty() && winner.isEmpty()) {
            board[row][col] = currentPlayer;
            checkGameStatus();
            currentPlayer = currentPlayer.equalsIgnoreCase("X") ? "O" : "X";
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

    private void populateGrid() {
        board = new String[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }
}
