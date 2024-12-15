// hooks/useGameManager.js
import { useState } from 'react';
import { createGame, joinGame } from "../utils/api";
import { useNavigate } from 'react-router';

export const useGameManager = () => {
  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const gameState = await createGame();
      sessionStorage.setItem("player", JSON.stringify(gameState.player1));
      sessionStorage.setItem("gameCreator", true);
      navigate(`/game/${gameState.gameId}`)
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const gameState = await joinGame(joinInput);
      sessionStorage.setItem("player", gameState.player2);
      navigate(`/game/${gameState.gameId}`)
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  return {
    joinInput,
    setJoinInput,
    handleCreateGame,
    handleJoinGame,
  };
};