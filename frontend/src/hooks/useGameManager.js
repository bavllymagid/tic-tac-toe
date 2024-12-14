// hooks/useGameManager.js
import { useState } from 'react';
import { createGame, joinGame } from "../utils/api";
import { useNavigate } from 'react-router';

export const useGameManager = () => {
  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const { gameId, player1 } = await createGame();
      sessionStorage.setItem("player", player1);
      navigate(`/game/${gameId}`)
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const { gameId, player2 } = await joinGame(joinInput);
      sessionStorage.setItem("player", player2);
      navigate(`/game/${gameId}`)
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