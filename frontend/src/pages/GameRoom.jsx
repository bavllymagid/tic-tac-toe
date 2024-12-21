import { GameBoard } from "../components/GameBoard";
import { useGameState } from "../hooks/useGameState";
import { useCallback } from "react";
import { useSnackbar } from "notistack";

export const GameRoom = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    winner,
    grid,
    playerSymbol,
    isDraw,
    status,
    gameId,
    handleEndGameClick,
    handleRestartGameClick,
    handleSquareClick,
  } = useGameState();

  const handleGameIdClicked = useCallback(() => {
    navigator.clipboard
      .writeText(gameId)
      .then(() => {
        enqueueSnackbar("Game ID copied to clipboard", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Error happend while copying Game ID", {
          variant: "error",
        });
      });
  }, [gameId, enqueueSnackbar]);

  return (
    <div className="container">
      <div className="gameId">
        Game ID:{" "}
        <span onClick={handleGameIdClicked} className="gameIdText">
          {gameId}
        </span>
      </div>
      <div className="status">{status}</div>
      <GameBoard grid={grid} onSquareClick={handleSquareClick} />
      <div className="status">Player: {playerSymbol}</div>
      {(winner || isDraw) && (
        <div className="resetOrEnd">
          <button onClick={handleRestartGameClick}>Rematch</button>
          <button onClick={handleEndGameClick}>Close</button>
        </div>
      )}
    </div>
  );
};