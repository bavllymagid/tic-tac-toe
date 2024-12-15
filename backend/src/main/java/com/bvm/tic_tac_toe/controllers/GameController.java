package com.bvm.tic_tac_toe.controllers;

import com.bvm.tic_tac_toe.exceptions.exception.NoSuchGameFoundException;
import com.bvm.tic_tac_toe.model.GameState;
import com.bvm.tic_tac_toe.services.GameServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tic-tac-toe")
public class GameController {
    private static final Logger log = LoggerFactory.getLogger(GameController.class);
    private final GameServiceImpl gameService;

    public GameController(GameServiceImpl gameService) {
        this.gameService = gameService;
    }

    @CrossOrigin(originPatterns = "*")
    @GetMapping("/create")
    public ResponseEntity<GameState> createGame() {
        GameState game = gameService.createGame();
        return ResponseEntity.ok(game);
    }

    @CrossOrigin(originPatterns = "*")
    @GetMapping("/join/{gameId}")
    public ResponseEntity<GameState> joinGame(@PathVariable String gameId,
                                              @RequestParam String playerId) throws NoSuchGameFoundException {
        GameState gameState = gameService.joinGame(gameId, playerId);
        return ResponseEntity.ok(gameState);
    }

    @CrossOrigin(originPatterns = "*")
    @DeleteMapping("/over/{gameId}")
    public ResponseEntity<Void> endGame(@PathVariable String gameId) {
        gameService.endGame(gameId);
        return ResponseEntity.noContent().build();
    }
}
