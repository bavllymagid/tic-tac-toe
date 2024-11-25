package com.bvm.tik_tak_toe.model;

public class Board {
    private final char[][] board;
    private final int size;
    private final Game game;
    private static Board boardInstance = null;

    private Board(Game game) {
        this.game = game;
        this.size = 3;
        this.board = new char[size][size];
    }

    public static synchronized Board getInstance(Game game) {
        if (boardInstance == null) {
            boardInstance = new Board(game);
        }
        return boardInstance;
    }

    public boolean move(int row, int col, Player player) {
        if (row < 0 || row >= size || col < 0 || col >= size) {
            return false;
        }
        if (board[row][col] != 0) {
            return false;
        }
        board[row][col] = player.getPlayerSymbol();
        return true;
    }

    public int checkWin() {
        for (int i = 0; i < size; i++) {
            if (checkRow(i) || checkCol(i)) {
                return board[i][0];
            }
        }
        if (checkDiagonal() || checkAntiDiagonal()) {
            return board[0][0];
        }
        return 0;
    }

    private boolean checkRow(int row) {
        for (int i = 1; i < size; i++) {
            if (board[row][i] != board[row][0]) {
                return false;
            }
        }
        return true;
    }

    private boolean checkCol(int col) {
        for (int i = 1; i < size; i++) {
            if (board[i][col] != board[0][col]) {
                return false;
            }
        }
        return true;
    }

    private boolean checkDiagonal() {
        for (int i = 1; i < size; i++) {
            if (board[i][i] != board[0][0]) {
                return false;
            }
        }
        return true;
    }

    private boolean checkAntiDiagonal() {
        for (int i = 1; i < size; i++) {
            if (board[i][size - 1 - i] != board[0][size - 1]) {
                return false;
            }
        }
        return true;
    }
}
