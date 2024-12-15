import { useState, useCallback, useEffect } from "react";
import {
  connectToWebSocket,
  disconnectWebSocket,
  processMove,
  wsJoinGame,
} from "../utils/webSocket";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { endGame, joinGame } from "../utils/api";

export const useGameState = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [gameState, setGameState] = useState({});

  const [status, setStatus] = useState("");
  const [player, setPlayer] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);

  const resetGame = useCallback(() => {
    if (!gameId) {
      return;
    }
    endGame(gameId).catch((error) =>
      console.error("Failed to end game:", error)
    );
    disconnectWebSocket();
    navigate("/");
  }, [gameId, navigate]);

  const handleSquareClick = useCallback(
    (row, col) => {
      const { board, winner, currentPlayer } = gameState;

      if (winner || board[row][col] || currentPlayer !== player) {
        console.log(`Invalid move in game ${gameId}`);
        return;
      }
      processMove(gameId, row, col);
    },
    [gameId, gameState, player]
  );

  const decideWinner = useCallback(
    (winner, draw) => {
      if (winner !== "" || draw) {
        console.log("Game over:", winner, draw);

        if (winner !== "") {
          if (player === winner) {
            setStatus("You Win");
          } else {
            setStatus("You Lost");
          }
        } else {
          setStatus("Game Draw");
        }

        setTimerCnt(3);

        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const remainingSeconds = Math.max(3 - elapsedSeconds, 0);
          setTimerCnt(remainingSeconds);

          if (remainingSeconds === 0) {
            clearInterval(interval);
            setGameState({});
            resetGame();
          }
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      }
    },
    [player, resetGame]
  );

  useEffect(() => {
    if (Object.keys(gameState).length === 0) {
      return;
    }

    if (gameState.currentPlayer === player) {
      setStatus(`Your turn`);
    } else {
      setStatus("Waiting for other player move");
    }

    // Handle winner and draw states
    if (gameState.winner !== "" || gameState.draw) {
      decideWinner(gameState.winner, gameState.draw);
    }
  }, [decideWinner, gameState, player]);

  const updateGameState = useCallback((newState) => {
    setGameState(newState);
    console.log("Game state updated:", newState);
  }, []);

  const handleJoinGame = useCallback(async () => {
    try {
      const game = await joinGame(gameId);
      let playerSymbol = sessionStorage.getItem("player");
      if (
        !playerSymbol ||
        (playerSymbol !== game.player1 && playerSymbol !== game.player2)
      ) {
        playerSymbol = game.player2;
        sessionStorage.setItem("player", playerSymbol);
      }

      setPlayer(playerSymbol.trimEnd().at(-1));
      console.log("I Have joined the game:", game, playerSymbol);
      connectToWebSocket(gameId, updateGameState, () => wsJoinGame(gameId));
    } catch (error) {
      enqueueSnackbar(
        `Error happened while joining the game: ${error.message}`,
        {
          variant: "error",
        }
      );
      navigate("/");
    }
  }, [enqueueSnackbar, gameId, navigate, updateGameState]);

  useEffect(() => {
    if (gameId) {
      handleJoinGame();
    }
  }, [gameId, handleJoinGame]);

  return {
    gameState,
    status,
    player,
    timerCnt,
    setTimerCnt,
    setPlayer,
    updateGameState,
    handleSquareClick,
    gameId,
  };
};
