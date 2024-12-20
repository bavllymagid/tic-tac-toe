import { GameBoard } from "../components/GameBoard";
import { useGameState } from "../hooks/useGameState";
import { useCallback } from "react";
import { useSnackbar } from "notistack";
// import CelebDisplay from "../components/ConfettiCeleb";

export const GameRoom = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    winner,
    board,
    playerSymbol,
    isDraw,
    status,
    gameId,
    handleSquareClick,
    handleGameEnd,
    handleGameReset,
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
      <GameBoard board={board} onSquareClick={handleSquareClick} />
      {/* {winner == playerSymbol && (
        <div className="winner">
          <CelebDisplay duration={3}/>
        </div>
      )} */}
      {(winner || isDraw) && (
        <div className="resetOrEnd">
          <button onClick={handleGameReset}>Reset</button>
          <button onClick={handleGameEnd}>End</button>
        </div>
      )}
      <div className="status">Player: {playerSymbol}</div>
    </div>
  );
};
