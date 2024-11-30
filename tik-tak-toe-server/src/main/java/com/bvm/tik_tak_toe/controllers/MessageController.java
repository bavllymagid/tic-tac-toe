package com.bvm.tik_tak_toe.controllers;

import com.bvm.tik_tak_toe.model.GameMove;
import com.bvm.tik_tak_toe.model.GameState;
import com.bvm.tik_tak_toe.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tic-tac-toe")
public class MessageController {

    private final GameService gameService;

    @Autowired
    public MessageController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/move/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public GameState processMove(@DestinationVariable String gameId, @Payload GameMove move) {
        GameState gameState = gameService.getGame(gameId);
        if (gameState != null && gameState.makeMove(move.getRow(), move.getCol())) {
            gameService.updateGame(gameId, gameState);
        }
        return gameState;
    }


}
