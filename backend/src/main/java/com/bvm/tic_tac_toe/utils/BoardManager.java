package com.bvm.tic_tac_toe.utils;

import com.bvm.tic_tac_toe.model.Board;
import com.bvm.tic_tac_toe.model.GameMove;
import com.bvm.tic_tac_toe.model.GameState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class BoardManager {

    private static final Logger log = LoggerFactory.getLogger(BoardManager.class);

    public boolean makeMove(GameState gameState, GameMove gameMove, int size, String mode) {
        int outerRow = gameMove.getOuterRow();
        int outerCol = gameMove.getOuterCol();
        int innerRow = gameMove.getInnerRow();
        int innerCol = gameMove.getInnerCol();

        // Validate input
        if (outerRow < 0 || outerRow >= size ||
                outerCol < 0 || outerCol >= size ||
                innerRow < 0 || innerRow >= 3 ||
                innerCol < 0 || innerCol >= 3) {
            log.info("Invalid move: {}", gameMove);
            return false;
        }

        // check if the outerRow and outerCol is in its correct value.
        if (mode.equalsIgnoreCase("super")) {
            int lastInnerCol = gameState.getLastMove().getInnerCol();
            int lastInnerRow = gameState.getLastMove().getInnerRow();
            if(lastInnerRow != -1 && lastInnerCol != -1){
                if (!gameState.getBoard()[lastInnerRow][lastInnerCol].isComplete()) {
                    if(outerRow != gameState.getLastMove().getInnerRow() || outerCol != gameState.getLastMove().getInnerCol()){
                        return false;
                    }
                }
            }
        }else{
            if(outerRow != 0 || outerCol != 0){
                return false;
            }
        }

        Board[][] board = gameState.getBoard();
        Board targetBoard = board[outerRow][outerCol];


        // Check if the targeted board is already won
        if (targetBoard.isComplete()) {
            return false;
        }

        // Check if the cell is already occupied
        if (targetBoard.getGrid()[innerRow][innerCol] != null) {
            return false;
        }

        // Make the move
        targetBoard.getGrid()[innerRow][innerCol] = gameState.getCurrentPlayer();

        // Check if this move wins the current sub-board
        checkSubBoardWinner(targetBoard);

        // If the sub-board is won, check for an overall winner
        if (targetBoard.getWinner() != null && mode.equalsIgnoreCase("super")) {
            checkForOverallWinner(gameState);
        }else{
            gameState.setWinner(targetBoard.getWinner());
        }

        // Check if the sub-board is a draw
        checkSubBoardDraw(targetBoard);

        // Check if the overall game is a draw
        if(mode.equalsIgnoreCase("super"))
            checkOverallDraw(gameState);
        else if(targetBoard.isComplete() && targetBoard.getWinner() == null)
            gameState.setDraw(true);

        return true;
    }

    public void checkForOverallWinner(GameState gameState) {
        Board[][] board = gameState.getBoard();
        // Check rows
        for (int i = 0; i < 3; i++) {
            if (board[i][0].getWinner() != null &&
                    board[i][0].getWinner().equals(board[i][1].getWinner()) &&
                    board[i][0].getWinner().equals(board[i][2].getWinner())) {
                gameState.setWinner(board[i][0].getWinner());
                return;
            }
        }

        // Check columns
        for (int j = 0; j < 3; j++) {
            if (board[0][j].getWinner() != null &&
                    board[0][j].getWinner().equals(board[1][j].getWinner()) &&
                    board[0][j].getWinner().equals(board[2][j].getWinner())) {
                gameState.setWinner(board[0][j].getWinner());
                return;
            }
        }

        // Check diagonals
        if (board[0][0].getWinner() != null &&
                board[0][0].getWinner().equals(board[1][1].getWinner()) &&
                board[0][0].getWinner().equals(board[2][2].getWinner())) {
            gameState.setWinner(board[0][0].getWinner());
            return;
        }

        if (board[0][2].getWinner() != null &&
                board[0][2].getWinner().equals(board[1][1].getWinner()) &&
                board[0][2].getWinner().equals(board[2][0].getWinner())) {
            gameState.setWinner(board[0][2].getWinner());
        }
    }

    public void checkSubBoardWinner(Board board) {
        String[][] grid = board.getGrid();
        // Check rows
        for (int i = 0; i < 3; i++) {
            if (grid[i][0] != null &&
                    grid[i][0].equals(grid[i][1]) &&
                    grid[i][0].equals(grid[i][2])) {
                board.setWinner(grid[i][0]);
                board.setComplete(true);
                return;
            }
        }

        // Check columns
        for (int j = 0; j < 3; j++) {
            if (grid[0][j] != null &&
                    grid[0][j].equals(grid[1][j]) &&
                    grid[0][j].equals(grid[2][j])) {
                board.setWinner(grid[0][j]);
                board.setComplete(true);
                return;
            }
        }

        // Check diagonals
        if (grid[0][0] != null &&
                grid[0][0].equals(grid[1][1]) &&
                grid[0][0].equals(grid[2][2])) {
            board.setWinner(grid[0][0]);
            board.setComplete(true);
            return;
        }

        if (grid[0][2] != null &&
                grid[0][2].equals(grid[1][1]) &&
                grid[0][2].equals(grid[2][0])) {
            board.setWinner(grid[0][2]);
            board.setComplete(true);
        }
    }

    public void checkSubBoardDraw(Board board) {
        if (board.getWinner() != null) {
            return; // If the board already has a winner, it's not a draw
        }

        String[][] grid = board.getGrid();
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (grid[i][j] == null) {
                    return; // There's still an empty cell, not a draw
                }
            }
        }

        board.setComplete(true); // Mark the board as complete
    }


    public void checkOverallDraw(GameState gameState) {
        if(gameState.getWinner() != null){
            return; // If the game already has a winner, it's not a draw
        }

        Board[][] board = gameState.getBoard();
        // If any sub-board is still incomplete, the game isn't a draw
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (!board[i][j].isComplete()) {
                    return;
                }
            }
        }
        // If all sub-boards are complete and there's no winner, it's a draw
        gameState.setDraw(true);
    }

    public Board[][] createBoard(int size) {
        Board[][] board = new Board[size][size];
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                board[i][j] = new Board();
            }
        }
        return board;
    }

}
