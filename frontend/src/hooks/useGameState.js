import { useState, useCallback, useEffect } from 'react';
import { connectToWebSocket, disconnectWebSocket, processMove, wsJoinGame } from '../utils/webSocket';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack'

import { endGame, joinGame } from '../utils/api';

export const useGameState = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [grid, setGrid] = useState(Array(3).fill(Array(3).fill("")));
  const [status, setStatus] = useState("");
  const [winner, setWinner] = useState("");
  const [isDraw, setIsDraw] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("");
  const [player, setPlayer] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);

  const resetGame = () => {
    if (!gameId) {
      return;
    }
    endGame(gameId).catch((error) => console.error("Failed to end game:", error));
    disconnectWebSocket();
    navigate('/');
  };

  const handleSquareClick = (row, col) => {
    if (winner || grid[row][col] || currentTurn !== player) {
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, row, col);
  };

  const handleJoinGame = useCallback(async () => {
    try {
      const game = await joinGame(gameId);
      let playerSymbol = sessionStorage.getItem('player');

      if (!playerSymbol || (playerSymbol !== game.player1 && playerSymbol !== game.player2)) {
        playerSymbol = game.player2;
        localStorage.setItem('player', playerSymbol);
      }

      setPlayer(playerSymbol.trim().at(-1));
    } catch (error) {
      enqueueSnackbar(`Error happened while joining the game: ${error.message}`, {
        variant: 'error',
      });
      navigate('/');
    }
  }, [enqueueSnackbar, gameId, navigate])

  const decideWinner = useCallback((winner, isDraw) => {
    if (winner !== "" || isDraw) {
      console.log("Game over:", winner, isDraw);

      if (winner !== "") {
        if (player === winner) {
          setStatus("You Win");
        }
        else {
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
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [player]);

  const updateGameState = useCallback((gameState) => {
    setGrid(gameState.board);
    setWinner(gameState.winner);
    setCurrentTurn(gameState.currentPlayer);
    setIsDraw(gameState.draw);

    if (gameState.currentPlayer === player) {
      setStatus(`Your turn`);
    } else {
      setStatus("Waiting for other player move");
    }

    // Handle winner and draw states
    if (gameState.winner !== "" || gameState.draw) {
      decideWinner(gameState.winner, gameState.draw);
    }

    console.log("Game state updated:", gameState);
  }, [player, decideWinner]);

  const resetGameState = () => {
    setWinner(null);
    setIsDraw(false);
    setCurrentTurn("");
    setGrid(Array(3).fill(Array(3).fill("")));
    setStatus("");
    setTimerCnt(3);
  };


  useEffect(() => {
    if (gameId) {
      connectToWebSocket(
        gameId,
        updateGameState,
        () => wsJoinGame(gameId)
      );
    }
  }, [gameId, updateGameState]);

  useEffect(() => {
    handleJoinGame();
  }, [handleJoinGame]);

  useEffect(() => {
    let timer;
    if (winner || isDraw) {
      timer = setTimeout(() => {
        resetGameState();
        resetGame();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [winner, isDraw]);

  return {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    player,
    timerCnt,
    setTimerCnt,
    setPlayer,
    updateGameState,
    resetGameState,
    handleSquareClick,
    gameId,
  };
};