package com.bvm.tik_tak_toe.utils;
import com.bvm.tik_tak_toe.model.GameState;
import org.springframework.stereotype.Component;

@Component
public class BoardManager {

    public boolean makeMove(GameState gameState,int row, int col) {
        String[][] board = gameState.getBoard();
        if (board[row][col] == null && gameState.getWinner().isEmpty()) {
            board[row][col] = gameState.getCurrentPlayer();
            gameState.setCurrentPlayer(gameState.getCurrentPlayer().equalsIgnoreCase("X") ? "O" : "X");
            return true;
        }
        return false;
    }

    public boolean checkIsWinner(String[][] board) {
        //check rows, columns
        for (int i = 0; i < 3; i++) {
            if (board[i][0] != null && board[i][0].equals(board[i][1]) && board[i][0].equals(board[i][2])) {
                return true;
            }
            if (board[0][i] != null && board[0][i].equals(board[1][i]) && board[0][i].equals(board[2][i])) {
                return true;
            }
        }

        //check diagonals
        if (board[0][0] != null && board[0][0].equals(board[1][1]) && board[0][0].equals(board[2][2])) {
            return true;
        }
        else if (board[0][2] != null && board[0][2].equals(board[1][1]) && board[0][2].equals(board[2][0])){
            return true;
        }

        return false;
    }

    public boolean checkIsDraw(String[][] board) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }
}
