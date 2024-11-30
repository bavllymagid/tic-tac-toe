package com.bvm.tik_tak_toe.services;

import com.bvm.tik_tak_toe.model.GameState;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<String, GameState> games = new ConcurrentHashMap<>();

    public GameState createGame() {
        GameState newGame = new GameState();
        newGame.setGameId(UUID.randomUUID().toString());
        games.put(newGame.getGameId(), newGame);
        return newGame;
    }

    public void endGame(String gameId) {
        games.remove(gameId);
    }

    public GameState getGame(String gameId) {
        return games.get(gameId);
    }

    public void updateGame(String gameId, GameState gameState) {
        games.put(gameId, gameState);
    }
}
