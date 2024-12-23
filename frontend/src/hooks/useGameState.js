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
    superGrid,
    isDraw,
    currentTurn,
    playerSymbol,
    isPopupOpen,
    isRequester,
    mode,
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
      console.log("Joined game super:", game.board);
      dispatch(updateGameState(game));
      dispatch(setPlayerSymbol(player?.symbol));
      enqueueSnackbar(`Player joined`, { variant: 'info' }, { autoHideDuration: 300 });
    } catch (error) {
      console.error(`Error joining game: ${error.message}`);
      enqueueSnackbar(`Error joining game: ${error.message}`, { variant: 'error' }, { autoHideDuration: 1000 });
      navigate('/');
    }
  }, [gameId, dispatch, enqueueSnackbar, navigate]);

  const resetGame = useCallback((action) => {
    if (!gameId) return;

    if (action === "END") {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      enqueueSnackbar(`Game has ended`, { variant: 'info' }, { autoHideDuration: 1000 });
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
  }, [gameId, dispatch, enqueueSnackbar, navigate, handleJoinGame]);

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
    handleSuperSquareClick
  };
};