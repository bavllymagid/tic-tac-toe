// useGameState.js
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPlayerSymbol,
  updateGameState,
  resetGameState,
  setIsPopupOpen,
  setIsRequester,
  setMode,
} from '../store/gameSlice';
import { connectToWebSocket, disconnectWebSocket, processMove, wsJoinGame, wsEndGame, wsRestartGame } from '../utils/webSocket';
import { joinGame, endGame} from '../utils/api';

export const useGameState = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const hasJoinedGame = useRef(false);
  const hasOtherPlayerJoined = useRef(0);
  const snackbarRef = useRef(null); // Store the last snackbar key

  // Get state from Redux
  const {
    grid,
    status,
    winner,
    superGrid,
    isDraw,
    currentTurn,
    playerSymbol,
    isPopupOpen,
    isRequester,
    mode,
    lastMove
  } = useSelector(state => state.game);

  const showSnackbar = useCallback((message, options) => {
    // Dismiss the last snackbar if it exists
    if (snackbarRef.current) {
      closeSnackbar(snackbarRef.current);
    }

    // Enqueue the new snackbar and store its key
    snackbarRef.current = enqueueSnackbar(message, options);
  }, [closeSnackbar, enqueueSnackbar]);

  const handleGameStateUpdate = useCallback((gameState) => {
    if(gameState.player2!=null && gameState.lastInteractionTime === null && hasOtherPlayerJoined.current <1) {
      showSnackbar(`Player joined`, { variant: 'info', autoHideDuration: 1000 });
      hasOtherPlayerJoined.current += 1;
    }
    dispatch(updateGameState(gameState));
  }, [dispatch, showSnackbar]);

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
      console.log("Joined game super:", game.board);
      dispatch(updateGameState(game));
      dispatch(setPlayerSymbol(player?.symbol));
      dispatch(setMode(game.mode));
    } catch (error) {
      console.error(`Error joining game: ${error.message}`);
      showSnackbar(`Error joining game: ${error.message}`, { variant: 'error', autoHideDuration: 1000 });
      navigate('/');
    }
  }, [gameId, dispatch, showSnackbar, navigate]);

  const resetGame = useCallback((action) => {
    if (!gameId) return;

    if (action === "END") {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      wsEndGame(gameId);
      disconnectWebSocket();
      showSnackbar(`Game has ended`, { variant: 'info', autoHideDuration: 1000 });
      navigate('/');
    }
    else if (action === "RESTART") {
      console.log("Restarting game:", gameId);
      dispatch(resetGameState());
      handleJoinGame();
    }
    dispatch(resetGameState());
  }, [gameId, dispatch, showSnackbar, navigate, handleJoinGame]);

  const handleSquareClick = (row, col) => {
    if ( winner || grid[row][col] || currentTurn !== playerSymbol) {
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, 0, 0, row, col);
  };

  const handleSuperSquareClick = (row, col, subRow, subCol) => {
    if (winner || superGrid[row][col].grid[subRow][subCol] || currentTurn !== playerSymbol) {
      console.log(`${superGrid[row][col].grid[subRow][subCol]}`)
      console.log(`${lastMove}`, `${row}`, `${col}`);
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, row, col, subRow, subCol);  
  }

  const handleEndGame = useCallback((res) => {
    if (res == 0) {
      resetGame("END");
    }
    else if (res == 1) {
      dispatch(setIsPopupOpen(true)); // Show the popup
    }
    else if (res == 2) {
      hasJoinedGame.current = false;
      resetGame("RESTART");
      handleJoinGame();
    }
  }
    , [dispatch, handleJoinGame, resetGame]);

  const handleEndGameClick = useCallback(() => {
    resetGame("END");
  }
    , [resetGame]);

  const handleRestartGameClick = useCallback(() => {
    wsRestartGame(gameId);
    dispatch(setIsRequester(true));
    dispatch(setIsPopupOpen(true));
  }, [dispatch, gameId]);

  const handlePopupRestart = useCallback(() => {
    dispatch(setIsPopupOpen(false));
    wsRestartGame(gameId);
  }, [dispatch, gameId])

  const handlePopupEnd = useCallback(() => {
    dispatch(setIsPopupOpen(false));
    resetGame("END");
  }, [dispatch, resetGame]);

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
    isPopupOpen,
    isRequester,
    handlePopupRestart,
    handlePopupEnd,
    mode,
    superGrid,
    handleSuperSquareClick,
    lastMove 
  };
};