// hooks/useGameState.js
import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [grid, setGrid] = useState(Array(3).fill(Array(3).fill("")));
  const [status, setStatus] = useState("");
  const [winner, setWinner] = useState("");
  const [isDraw, setIsDraw] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("");
  const [player, setPlayer] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);

  const decideWinner = useCallback((winner, isDraw) => {
    if (winner !== "" || isDraw) {
      console.log("Game over:", winner, isDraw);
      
      if (winner !== "") {
        setStatus(`Player ${winner} Wins`);
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
  }, []);

  const updateGameState = useCallback((gameState) => {
    setGrid(gameState.board);
    setWinner(gameState.winner);
    setCurrentTurn(gameState.currentPlayer);
    setIsDraw(gameState.draw);
    
    if (gameState.currentPlayer === player) {
      setStatus(`Player ${gameState.currentPlayer} Turn`);
    } else {
      setStatus("Waiting for player...");
    }

    // Handle winner and draw states
    if (gameState.winner !== "" || gameState.draw) {
      decideWinner(gameState.winner, gameState.draw);
    }

    console.log("Game state updated:", gameState);
  }, [player, decideWinner]);

  const resetGameState = () => {
    setWinner(null);
    setIsDraw(false);
    setCurrentTurn("");
    setGrid(Array(3).fill(Array(3).fill("")));
    setStatus("");
    setTimerCnt(3);
  };

  return {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    player,
    timerCnt,
    setTimerCnt,
    setPlayer,
    updateGameState,
    resetGameState
  };
};