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
import { resetGameCall, endGame, joinGame } from '../utils/api';

export const useGameState = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const hasJoinedGame = useRef(false);
  const isResetClicked = useRef(null);

  // Get state from Redux
  const {
    board,
    status,
    winner,
    isDraw,
    currentTurn,
    playerSymbol,
    timerCnt
  } = useSelector(state => state.game);

  const resetGame = useCallback(() => {
    if (!gameId) return;
    
    dispatch(resetGameState());
    if(!isResetClicked.current == true){
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      disconnectWebSocket();
      navigate('/');
    } else if(isResetClicked.current == true){
      resetGameCall(gameId).catch((error) => console.error("Failed to reset game:", error));
      hasJoinedGame.current = false;
    }
  }, [gameId, dispatch, navigate, hasJoinedGame]);

  const handleSquareClick = (row, col) => {
    if (winner || board[row][col] || currentTurn !== playerSymbol) {
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

  const handleGameEnd = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleGameReset = useCallback(() => {
    isResetClicked.current = true;
    resetGame();
    handleJoinGame();
  }, [handleJoinGame, resetGame]);

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
    if (!hasJoinedGame.current) {
      handleJoinGame();
      hasJoinedGame.current = true;
    }
  }, [handleJoinGame]);



  return {
    board,
    status,
    winner,
    isDraw,
    currentTurn,
    playerSymbol,
    timerCnt,
    handleSquareClick,
    handleGameEnd,
    handleGameReset,
    gameId,
  };
};