import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);
  const hasJoinedGame = useRef(false);

  const resetGame = () => {
    if (!gameId) {
      return;
    }
    endGame(gameId).catch((error) => console.error("Failed to end game:", error));
    disconnectWebSocket();
    navigate('/');
  };

  const handleSquareClick = (row, col) => {
    if (winner || grid[row][col] || currentTurn !== playerSymbol) {
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, row, col);
  };

  const handleJoinGame = useCallback(async () => {
    try {
      console.log("Joining game:", gameId);
  
      // Retrieve the player data from sessionStorage
      const playerData = sessionStorage.getItem('player');
      let player = null;
  
      if (playerData) {
        try {
          player = JSON.parse(playerData); // Parse only if data is available
        } catch (error) {
          console.error("Invalid player data in sessionStorage. Resetting storage.", error);
          sessionStorage.removeItem('player'); // Clear invalid data
          player = null;
        }
      }
  
      console.log("Get my Player:", player?.id);
  
      // Join the game using the player's ID if available
      const game = await joinGame(gameId, player?.id);
      console.log("I Have joined the game:", game, player);
  
      // Check if the player is not in the game, and update sessionStorage if necessary
      if (!player || (player.id !== game.player1.id && player.id !== game.player2.id)) {
        player = game.player2;
        sessionStorage.setItem("player", JSON.stringify(player)); // Properly stringify
      }
      setPlayerSymbol(player?.symbol);
    } catch (error) {
      // Handle errors and provide feedback
      enqueueSnackbar(`Error happened while joining the game: ${error.message}`, {
        variant: 'error',
      });
      navigate('/');
    }
  }, [enqueueSnackbar, gameId, navigate]);
  


  const decideWinner = useCallback((winner, isDraw) => {
    if (winner !== "" || isDraw) {
      console.log("Game over:", winner, isDraw);

      if (winner !== "") {
        console.log("Player", playerSymbol);
        if (playerSymbol === winner) {
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
  }, [playerSymbol]);

  const updateGameState = useCallback((gameState) => {
    setGrid(gameState.board);
    setWinner(gameState.winner);
    setCurrentTurn(gameState.currentPlayer);
    setIsDraw(gameState.draw);

    if (sessionStorage.getItem("gameCreator")) setPlayerSymbol(gameState.player1.symbol);
    else setPlayerSymbol(gameState.player2.symbol);
    console.log("Player infoo :", playerSymbol);

    if (gameState.currentPlayer === playerSymbol) {
      setStatus(`Your turn`);
    } else {
      setStatus("Waiting for other player move");
    }

    // Handle winner and draw states
    if (gameState.winner !== "" || gameState.draw) {
      decideWinner(gameState.winner, gameState.draw);
    }

    console.log("Game state updated:", gameState);
  }, [playerSymbol, decideWinner]);

  const resetGameState = () => {
    setWinner(null);
    setIsDraw(false);
    setCurrentTurn("");
    setGrid(Array(3).fill(Array(3).fill("")));
    setStatus("");
    setTimerCnt(3);
    sessionStorage.removeItem("gameCreator");
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
    if (!sessionStorage.getItem("gameCreator") && !hasJoinedGame.current) {
      console.log("Joining game:", gameId);
      handleJoinGame();
      hasJoinedGame.current = true;
    }
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
    playerSymbol,
    timerCnt,
    setTimerCnt,
    setPlayerSymbol,
    updateGameState,
    resetGameState,
    handleSquareClick,
    gameId,
  };
};