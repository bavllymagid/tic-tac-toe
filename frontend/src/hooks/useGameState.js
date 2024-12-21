// useGameState.js
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setPlayerSymbol, 
  updateGameState, 
  resetGameState,
  setTimerCount 
} from '../store/gameSlice';
import { connectToWebSocket, disconnectWebSocket, processMove, wsJoinGame } from '../utils/webSocket';
import { endGame, joinGame } from '../utils/api';

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
    timerCnt
  } = useSelector(state => state.game);

  const resetGame = () => {
    if (!gameId) return;
    
    endGame(gameId).catch((error) => console.error("Failed to end game:", error));
    disconnectWebSocket();
    dispatch(resetGameState());
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
      const playerData = sessionStorage.getItem('player');
      let player = null;

      if (playerData) {
        try {
          player = JSON.parse(playerData);
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
      
      dispatch(setPlayerSymbol(player?.symbol));
    } catch (error) {
      enqueueSnackbar(`Error joining game: ${error.message}`, { variant: 'error' });
      navigate('/');
    }
  }, [enqueueSnackbar, gameId, navigate, dispatch]);

  const handleGameStateUpdate = useCallback((gameState) => {
    dispatch(updateGameState(gameState));
    
    if (gameState.winner !== "" || gameState.draw) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const remainingSeconds = Math.max(3 - Math.floor((Date.now() - startTime) / 1000), 0);
        dispatch(setTimerCount(remainingSeconds));
        
        if (remainingSeconds === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch]);

  // WebSocket connection effect
  useEffect(() => {
    if (gameId) {
      connectToWebSocket(
        gameId,
        handleGameStateUpdate,
        () => wsJoinGame(gameId)
      );
    }
  }, [gameId, handleGameStateUpdate]);

  // Join game effect
  useEffect(() => {
    if (!sessionStorage.getItem("gameCreator") && !hasJoinedGame.current) {
      handleJoinGame();
      hasJoinedGame.current = true;
    }
  }, [handleJoinGame]);

  // Game end effect
  useEffect(() => {
    let timer;
    if (winner || isDraw) {
      timer = setTimeout(() => {
        dispatch(resetGameState());
        resetGame();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [winner, isDraw, dispatch]);

  return {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    playerSymbol,
    timerCnt,
    handleSquareClick,
    gameId,
  };
};