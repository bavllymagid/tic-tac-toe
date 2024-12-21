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
    timerCnt,
    status,
    gameId,
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
      {(winner || isDraw) && (
        <div className="resetMessage">
          Game will reset in {timerCnt} seconds...
        </div>
      )}
      <div className="status">Player: {playerSymbol}</div>
    </div>
  );
};