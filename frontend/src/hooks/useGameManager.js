// hooks/useGameManager.js
import { useState } from 'react';
import { createGame, joinGame } from "../utils/api";
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { 
  setPlayerSymbol, 
} from '../store/gameSlice';


export const useGameManager = () => {
  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateGame = async () => {
    try {
      const gameState = await createGame("classic");
      sessionStorage.setItem("player", JSON.stringify(gameState.player1));
      sessionStorage.setItem("gameCreator", true);
      dispatch(setPlayerSymbol(gameState.player1?.symbol));
      navigate(`/game/${gameState.gameId}`)
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const gameState = await joinGame(joinInput);
      sessionStorage.setItem("player", JSON.stringify(gameState.player2));
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