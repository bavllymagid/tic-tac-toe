package com.bvm.tik_tak_toe.services;

import com.bvm.tik_tak_toe.dto.Session;
import com.bvm.tik_tak_toe.exceptions.InvalidMoveException;
import com.bvm.tik_tak_toe.model.Board;
import com.bvm.tik_tak_toe.model.Game;
import com.bvm.tik_tak_toe.model.Player;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {
    public Session processMove(Game game, Player player, int row, int col) throws InvalidMoveException {
        Board board = Board.getInstance(game);
        if (!board.move(row, col, player)) {
            throw new InvalidMoveException("Invalid move");
        }

        int winner = board.checkWin();
        if (winner != 0) {
            game.setWinner(winner);
        }

        if (game.getWinner() == 0) {
            game.setNextPlayer(game.getNextPlayer() == game.getFirstPlayer() ? game.getSecondPlayer() : game.getFirstPlayer());
        }

        return new Session(game, board);
    }

    public Game createGame(Player firstPlayer) {
        Game game = new Game();
        game.setGameId(UUID.randomUUID().toString());
        game.setFirstPlayer(firstPlayer);
        Board.getInstance(game);
        return game;
    }

    public Game joinGame(Game game, Player SecondPlayer) {
        game.setSecondPlayer(SecondPlayer);
        return game;
    }
}
