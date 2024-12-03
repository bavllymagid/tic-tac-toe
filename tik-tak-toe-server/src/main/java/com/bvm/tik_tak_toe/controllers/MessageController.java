package com.bvm.tik_tak_toe.controllers;

import com.bvm.tik_tak_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tik_tak_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tik_tak_toe.model.GameMove;
import com.bvm.tik_tak_toe.model.GameState;
import com.bvm.tik_tak_toe.services.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    private static final Logger log = LoggerFactory.getLogger(MessageController.class);
    private final GameService gameService;

    @Autowired
    public MessageController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/move/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public GameState processMove(@DestinationVariable String gameId, @Payload GameMove move) throws InvalidMoveException {
        GameState gameState = gameService.getGame(gameId);
        printGameState(gameState);
        if (gameState != null
                && gameState.makeMove(move.getRow(), move.getCol())
                && gameState.getPlayer2() != null) {
            gameService.updateGame(gameId, gameState);
        } else {
            throw new InvalidMoveException("Invalid move");
        }
        return gameState;
    }

    private void printGameState(GameState gameState) {
        for (int i = 0; i < 3; i++) {
            log.info("[{},{},{}]", gameState.getBoard()[i][0], gameState.getBoard()[i][1], gameState.getBoard()[i][2]);
            log.info(gameState.getGameId());
            log.info(gameState.getPlayer1());
            log.info(gameState.getPlayer2());
        }
    }

    @MessageMapping("/join/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public GameState joinGame(@DestinationVariable String gameId) throws NoSuchGameFoundException {
        GameState gameState = gameService.getGame(gameId);
        printGameState(gameState);
        if (gameState == null) {
            throw new NoSuchGameFoundException("No such game found");
        }
        log.debug("Player joined game with id: {}", gameState.getPlayer2());
        return gameState;
    }



}
