package com.bvm.tic_tac_toe.services;

import com.bvm.tic_tac_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tic_tac_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tic_tac_toe.model.GameMove;
import com.bvm.tic_tac_toe.model.GameState;
import com.bvm.tic_tac_toe.model.Player;
import com.bvm.tic_tac_toe.utils.BoardManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@EnableScheduling
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
        Random random = new Random();
        GameState newGame = new GameState();
        newGame.setGameId(UUID.randomUUID().toString());
        newGame.setPlayer1(new Player(UUID.randomUUID().toString(),
                random.nextBoolean() ? "X" : "O"));
        newGame.setLastMove(System.currentTimeMillis());
        games.put(newGame.getGameId(), newGame);
        log.info("Created new game with id: {}", newGame.getGameId());
        return newGame;
    }

    @Override
    public GameState joinGame(String gameId, String playerId) throws NoSuchGameFoundException {
        GameState gameState = getGame(gameId);
        Random random = new Random();
        if (gameState != null) {
            if(gameState.getPlayer2() != null &&
                    !rejoin(gameId, playerId)){
                throw new NoSuchGameFoundException("No such game found");
            }else{
                String tempId = gameState.getPlayer1().getId();
                if(!tempId.equals(playerId) && gameState.getPlayer2() == null){
                    gameState.setPlayer2(new Player(UUID.randomUUID().toString(),
                            gameState.getPlayer1().getSymbol().equals("X") ? "O" : "X"));
                    gameState.setCurrentPlayer(random.nextBoolean() ? "X" : "O");
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
        String player1 = gameState.getPlayer1().getId();
        String player2 = gameState.getPlayer2().getId();
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
        gameState.setLastMove(System.currentTimeMillis());
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

    @Scheduled(fixedRate = 60000)
    private void checkInActiveGame(){
        games.forEach((k, v) -> {
            if(System.currentTimeMillis() - v.getLastMove() > Duration.ofHours(1).toMillis()){
                games.remove(k);
                log.info("Game with id: {} ended due to inactivity", k);
            }
        });
    }

}
