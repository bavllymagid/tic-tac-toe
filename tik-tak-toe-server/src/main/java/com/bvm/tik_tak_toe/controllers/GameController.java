package com.bvm.tik_tak_toe.controllers;


import com.bvm.tik_tak_toe.model.GameState;
import com.bvm.tik_tak_toe.services.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tic-tac-toe")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/create")
    public ResponseEntity<GameState> createGame() {
        GameState game = gameService.createGame();
        return ResponseEntity.ok(game);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/join/{gameId}")
    public ResponseEntity<GameState> joinGame(@PathVariable String gameId) {
        GameState gameState = gameService.getGame(gameId);
        if (gameState != null) {
            return ResponseEntity.ok(gameState);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/over/{gameId}")
    public ResponseEntity<Void> endGame(@PathVariable String gameId) {
        gameService.endGame(gameId);
        return ResponseEntity.noContent().build();
    }
}
