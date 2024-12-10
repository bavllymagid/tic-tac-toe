// hooks/useGameManager.js
import { useState, useEffect } from 'react';
import { createGame, joinGame, endGame } from "../utils/api";
import { connectToWebSocket, wsJoinGame, disconnectWebSocket } from "../utils/webSocket";

export const useGameManager = (onGameStateUpdate) => {
  const [gameId, setGameId] = useState(null);
  const [isGameJoined, setIsGameJoined] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);

  useEffect(() => {
    if (gameId) {
      connectToWebSocket(
        gameId,
        onGameStateUpdate,
        () => wsJoinGame(gameId)
      );
    }
  }, [gameId]);

  const handleCreateGame = async () => {
    try {
      const game = await createGame();
      setGameId(game.gameId);
      setIsGameJoined(true);
      return game.player1.charAt(game.player1.length - 1);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const game = await joinGame(joinInput);
      setGameId(game.gameId);
      setIsGameJoined(true);
      return game.player2.charAt(game.player2.length - 1);
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const resetGame = () => {
    setTimerCnt(4);
    setIsGameJoined(false);
    setJoinInput("");
    
    if (gameId) {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      setGameId(null);
    }
    disconnectWebSocket();
  };

  return {
    gameId,
    isGameJoined,
    joinInput,
    timerCnt,
    setJoinInput,
    setTimerCnt,
    handleCreateGame,
    handleJoinGame,
    resetGame
  };
};