import { useGameManager } from "../hooks/useGameManager";
import { GameSetup } from "../components/GameSetup";
import "../styles/tic-tac-toe.css";

const TicTacToe = () => {
  const { joinInput, setJoinInput, handleCreateGame, handleJoinGame } =
    useGameManager();

  return (
    <GameSetup
      joinInput={joinInput}
      onJoinInputChange={setJoinInput}
      onCreateGame={handleCreateGame}
      onJoinGame={handleJoinGame}
    />
  );
};

export default TicTacToe;
