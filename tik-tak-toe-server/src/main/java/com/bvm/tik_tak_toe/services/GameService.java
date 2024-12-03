package com.bvm.tik_tak_toe.services;

import com.bvm.tik_tak_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tik_tak_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tik_tak_toe.model.GameMove;
import com.bvm.tik_tak_toe.model.GameState;

public interface GameService {
    GameState createGame();
    GameState joinGame(String gameId);
    void endGame(String gameId) throws NoSuchGameFoundException;
    GameState getGame(String gameId)throws NoSuchGameFoundException;
    GameState updateGame(String gameId, GameMove move) throws InvalidMoveException,NoSuchGameFoundException;
}
