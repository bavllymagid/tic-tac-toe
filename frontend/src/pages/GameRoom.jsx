import { GameBoard } from "../components/GameBoard";
import { SuperGameBoard } from "../components/SuperGameBoard";
import { useGameState } from "../hooks/useGameState";
import { useCallback } from "react";
import { useSnackbar } from "notistack";
import Confetti from "react-confetti";
import PopupPrompt from "../components/ResetPopup";

export const GameRoom = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    winner,
    grid,
    superGrid,
    playerSymbol,
    isDraw,
    status,
    gameId,
    handleEndGameClick,
    handleRestartGameClick,
    handleSquareClick,
    isPopupOpen,
    isRequester,
    handlePopupRestart,
    handlePopupEnd,
    mode,
    handleSuperSquareClick,
    lastMove
  } = useGameState();

  const handleGameIdClicked = useCallback(() => {
    navigator.clipboard
      .writeText(gameId)
      .then(() => {
        enqueueSnackbar("Game ID copied to clipboard", {
          variant: "success",
        }, { autoHideDuration: 1000 });
      })
      .catch(() => {
        enqueueSnackbar("Error happend while copying Game ID", {
          variant: "error",
        }, { autoHideDuration: 1000 });
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
      {mode === "super" ? (
        <SuperGameBoard
          boards={superGrid}
          onBoardSquareClick={handleSuperSquareClick}
          hasTurn={lastMove}
        />
      ) : mode === "classic" ? (
        <GameBoard grid={grid} onSquareClick={handleSquareClick} />
      ) : null}
      <div className="status">Player: {playerSymbol}</div>
      {(winner || isDraw) && (
        <div className="resetOrEnd">
          <button onClick={handleRestartGameClick}>Rematch</button>
          <button onClick={handleEndGameClick}>Close</button>
        </div>
      )}
      {
        winner == playerSymbol && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
          />
        )
      }
      <PopupPrompt
        isOpen={isPopupOpen}
        onRestart={handlePopupRestart}
        onEnd={handlePopupEnd}
        isRequester={isRequester}
      />
    </div>
  );
};