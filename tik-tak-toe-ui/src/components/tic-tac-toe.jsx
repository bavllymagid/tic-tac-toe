// components/TicTacToe.jsx
import { useEffect } from "react";
import { useGameState } from "../hooks/useGameState";
import { useGameManager } from "../hooks/useGameManager";
import { GameBoard } from "./GameBoard";
import { GameSetup } from "./GameSetup";
import { processMove } from "../utils/webSocket";
import "../styles/tic-tac-toe.css";

const TicTacToe = () => {
  const {
    grid,
    status,
    winner,
    isDraw,
    currentTurn,
    player,
    timerCnt,
    setPlayer,
    updateGameState,
    resetGameState
  } = useGameState();

  const {
    gameId,
    isGameJoined,
    joinInput,
    setJoinInput,
    handleCreateGame,
    handleJoinGame,
    resetGame
  } = useGameManager(updateGameState);

  const handleSquareClick = (row, col) => {
    if (winner || grid[row][col] || currentTurn !== player) {
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    processMove(gameId, row, col);
  };

  useEffect(() => {
    let timer;
    if (winner || isDraw) {
      timer = setTimeout(() => {
        resetGameState();
        resetGame();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [winner, isDraw]);

  if (!isGameJoined) {
    return (
      <GameSetup
        joinInput={joinInput}
        onJoinInputChange={setJoinInput}
        onCreateGame={async () => {
          const playerSymbol = await handleCreateGame();
          setPlayer(playerSymbol);
        }}
        onJoinGame={async () => {
          const playerSymbol = await handleJoinGame();
          setPlayer(playerSymbol);
        }}
      />
    );
  }

  return (
    <div className="container">
      <div className="gameId">
        Game ID: <span className="gameIdText">{gameId}</span>
      </div>
      <div className="status">{status}</div>
      <GameBoard grid={grid} onSquareClick={handleSquareClick} />
      {(winner || isDraw) && (
        <div className="resetMessage">
          Game will reset in {timerCnt} seconds...
        </div>
      )}
      <div className="status">Player: {player}</div>
    </div>
  );
};

export default TicTacToe;