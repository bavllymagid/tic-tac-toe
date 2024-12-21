package com.bvm.tic_tac_toe.controllers;

import com.bvm.tic_tac_toe.exceptions.exception.InvalidMoveException;
import com.bvm.tic_tac_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tic_tac_toe.model.GameMove;
import com.bvm.tic_tac_toe.model.GameState;
import com.bvm.tic_tac_toe.services.GameServiceImpl;
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
    private final GameServiceImpl gameService;

    @Autowired
    public MessageController(GameServiceImpl gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/move/{gameId}")
    @SendTo("/state/game/{gameId}")
    public GameState processMove(@DestinationVariable String gameId, @Payload GameMove move)
            throws InvalidMoveException,
            NoSuchGameFoundException {
        return gameService.updateGame(gameId, move);
    }

    @MessageMapping("/join/{gameId}")
    @SendTo("/state/game/{gameId}")
    public GameState joinGame(@DestinationVariable String gameId) throws NoSuchGameFoundException {
        GameState gameState = gameService.getGame(gameId);
        if (gameState == null) {
            throw new NoSuchGameFoundException("No such game found");
        }
        log.debug("Player joined game with id: {}", gameState.getPlayer2());
        return gameState;
    }

    @MessageMapping("/over/{gameId}")
    @SendTo("/action/game/{gameId}")
    public Integer endGame(@DestinationVariable String gameId) {
        gameService.endGame(gameId);
        return 0;
    }

    @MessageMapping("/reset/{gameId}")
    @SendTo("/action/game/{gameId}")
    public Integer resetGame(@DestinationVariable String gameId) throws NoSuchGameFoundException {
        return gameService.resetGame(gameId);
    }
}
