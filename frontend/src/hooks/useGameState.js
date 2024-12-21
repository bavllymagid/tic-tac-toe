// useGameState.js
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPlayerSymbol,
  updateGameState,
  resetGameState,
} from '../store/gameSlice';
import { connectToWebSocket, disconnectWebSocket, processMove, wsJoinGame, wsEndGame, wsRestartGame } from '../utils/webSocket';
import { joinGame, endGame} from '../utils/api';

export const useGameState = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const hasJoinedGame = useRef(false);

  // Get state from Redux
  const {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    playerSymbol,
  } = useSelector(state => state.game);

  const handleGameStateUpdate = useCallback((gameState) => {
    dispatch(updateGameState(gameState));
  }, [dispatch]);

  const handleJoinGame = useCallback(async () => {
    try {
      console.log("Joining game:", gameId);
      const playerData = sessionStorage.getItem('player');
      let player = null;
      console.log(playerData);
      if (playerData) {
        try {
          player = JSON.parse(playerData);
          console.log(player);
        } catch (error) {
          console.error("Invalid player data in sessionStorage", error);
          sessionStorage.removeItem('player');
        }
      }
      const game = await joinGame(gameId, player?.id);
      if (!player || (player.id !== game.player1.id && player.id !== game.player2.id)) {
        player = game.player2;
        sessionStorage.setItem("player", JSON.stringify(player));
      }
      dispatch(updateGameState(game));
      dispatch(setPlayerSymbol(player?.symbol));
    } catch (error) {
      console.error(`Error joining game: ${error.message}`);
      enqueueSnackbar(`Error joining game: ${error.message}`, { variant: 'error' });
      navigate('/');
    }
  }, [gameId, dispatch, enqueueSnackbar, navigate]);

  const resetGame = useCallback((action) => {
    if (!gameId) return;

    if (action === "END") {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      wsEndGame(gameId);
      disconnectWebSocket();
      navigate('/');
    }
    else if (action === "RESTART") {
      console.log("Restarting game:", gameId);
      dispatch(resetGameState());
      handleJoinGame();
    }
    dispatch(resetGameState());
  }, [gameId, dispatch, navigate, handleJoinGame]);

  const handleSquareClick = (row, col) => {
    if ( winner || grid[row][col] || currentTurn !== playerSymbol) {
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, row, col);
  };


  const handleEndGame = useCallback((res) => {
    if (res == 0) {
      resetGame("END");
    }
    else if (res == 1) {
      //add popup for that the other player wants to restart the game yes/no 
      //if yes then call wsRestartGame
      //if no then do nothing
    }
    else if (res == 2) {
      hasJoinedGame.current = false;
      resetGame("RESTART");
      handleJoinGame();
    }
  }
    , [handleJoinGame, resetGame]);

  const handleEndGameClick = useCallback(() => {
    resetGame("END");
  }
    , [resetGame]);

  const handleRestartGameClick = useCallback(() => {
    wsRestartGame(gameId);
  }, [gameId]);

  // WebSocket connection effect
  useEffect(() => {
    if (gameId) {
      connectToWebSocket(
        gameId,
        handleGameStateUpdate,
        () => wsJoinGame(gameId),
        handleEndGame
      );
    }
  }, [gameId, handleEndGame, handleGameStateUpdate]);

  // Join game effect
  useEffect(() => {
    if (!hasJoinedGame.current) {
      hasJoinedGame.current = true;
      handleJoinGame();
    }
  }, [dispatch, handleJoinGame, hasJoinedGame]);

  return {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    playerSymbol,
    handleSquareClick,
    gameId,
    handleEndGameClick,
    handleRestartGameClick,
  };
};