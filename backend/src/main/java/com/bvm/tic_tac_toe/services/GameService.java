package com.bvm.tic_tac_toe.services;

import com.bvm.tic_tac_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tic_tac_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tic_tac_toe.model.GameMove;
import com.bvm.tic_tac_toe.model.GameState;

public interface GameService {
    GameState createGame();
    GameState joinGame(String gameId, String playerId);
    void endGame(String gameId) throws NoSuchGameFoundException;
    GameState getGame(String gameId) throws NoSuchGameFoundException;
    GameState updateGame(String gameId, GameMove move) throws InvalidMoveException, NoSuchGameFoundException;
    GameState resetGame(String gameId) throws NoSuchGameFoundException;
}
