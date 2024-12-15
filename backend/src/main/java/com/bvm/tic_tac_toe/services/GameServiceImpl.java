package com.bvm.tic_tac_toe.services;

import com.bvm.tic_tac_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tic_tac_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tic_tac_toe.model.GameMove;
import com.bvm.tic_tac_toe.model.GameState;
import com.bvm.tic_tac_toe.utils.BoardManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameServiceImpl implements GameService {

    private static final Logger log = LoggerFactory.getLogger(GameServiceImpl.class);
    private final Map<String, GameState> games = new ConcurrentHashMap<>();
    private final BoardManager boardManager;

    @Autowired
    public GameServiceImpl(BoardManager boardManager) {
        this.boardManager = boardManager;
    }

    @Override
    public GameState createGame() {
        GameState newGame = new GameState();
        newGame.setGameId(UUID.randomUUID().toString());
        newGame.setPlayer1(UUID.randomUUID() + "-X");
        games.put(newGame.getGameId(), newGame);
        log.info("Created new game with id: {}", newGame.getGameId());
        return newGame;
    }

    @Override
    public GameState joinGame(String gameId, String playerId) throws NoSuchGameFoundException {
        GameState gameState = getGame(gameId);
        if (gameState != null) {
            if(gameState.getPlayer2() != null &&
                    !gameState.getPlayer2().isEmpty() &&
                    !rejoin(gameId, playerId)){
                throw new NoSuchGameFoundException("No such game found");
            }else{
                String tempId = gameState.getPlayer1().substring(0, gameState.getPlayer1().indexOf("-"));
                if(!tempId.equals(playerId) &&
                        (gameState.getPlayer2() == null || Objects.requireNonNull(gameState.getPlayer2()).isEmpty())){
                    gameState.setPlayer2(UUID.randomUUID() + "-O");
                    gameState.setCurrentPlayer("X");
                }
                log.info("Player joined game with id: {}", gameState.getGameId());
            }
            return gameState;
        } else {
            throw new NoSuchGameFoundException("No such game found");
        }
    }


    private boolean rejoin(String gameId, String playerId){
        GameState gameState = getGame(gameId);
        String player1 = gameState.getPlayer1().substring(0, gameState.getPlayer1().indexOf("-"));
        String player2 = gameState.getPlayer2().substring(0, gameState.getPlayer2().indexOf("-"));
        return player1.equals(playerId) || player2.equals(playerId);
    }


    @Override
    public void endGame(String gameId) {
        games.remove(gameId);
        log.info("Game with id: {} ended", gameId);
    }

    @Override
    public GameState getGame(String gameId) {
        return games.get(gameId);
    }

    @Override
    public GameState updateGame(String gameId, GameMove move) throws InvalidMoveException,
            NoSuchGameFoundException {
        GameState gameState = games.get(gameId);
        if (gameState == null) {
            throw new NoSuchGameFoundException("No such game found");
        }

        if (!processMove(gameState, move)) {
            throw new InvalidMoveException("Invalid move");
        }

        if (boardManager.checkIsDraw(gameState.getBoard())) {
            gameState.setDraw(true);
        } else if (boardManager.checkIsWinner(gameState.getBoard())) {
            gameState.setWinner(gameState.getBoard()[move.getRow()][move.getCol()]);
        }

        games.put(gameId, gameState);
        return gameState;
    }

    private boolean processMove(GameState gameState, GameMove move) {
        return boardManager.makeMove(gameState, move.getRow(), move.getCol())
                || gameState.getPlayer2() != null;
    }

}
