import { useState, useEffect } from "react";
import { connectToWebSocket, processMove } from "../utils/webSocket"; // WebSocket helpers
import { createGame, joinGame, endGame } from "../utils/api"; // API helpers
import "../styles/tic-tac-toe.css";

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("Next player: X");
  const [gameOver, setGameOver] = useState(false);
  const [timerCnt, setTimerCnt] = useState(3);
  const [gameId, setGameId] = useState(null);
  const [isGameJoined, setIsGameJoined] = useState(false);
  const [joinInput, setJoinInput] = useState("");

  // Handle user moves
  const handleClick = (i) => {
    if (gameOver || squares[i] || !gameId) {
      console.log(`Invalid move ${gameId}`);
      return;
    }
    const row = Math.floor(i / 3);
    const col = i % 3;
    processMove(gameId, row, col); // Send move via WebSocket
  };

  // Reset game state
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setStatus("Next player: X");
    setGameOver(false);
    setTimerCnt(3);
    if (gameId) {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      setGameId(null);
    }
  };

  // Create a new game
  const handleCreateGame = async () => {
    try {
      const game = await createGame();
      setGameId(game.gameId);
      setIsGameJoined(true);
      setStatus("Waiting for opponent...");
      console.log("Game created:", gameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  // Join an existing game
  const handleJoinGame = async () => {
    try {
      const game = await joinGame(joinInput);
      setGameId(game.id);
      setIsGameJoined(true);
      setStatus("Game joined. Your move!");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      connectToWebSocket((newGameState) => {
        setSquares(newGameState.board.flat());
        if (newGameState.winner) {
          setStatus(`Winner: ${newGameState.winner}`);
          setGameOver(true);
        } else if (newGameState.isDraw) {
          setStatus("Draw!");
          setGameOver(true);
        } else {
          setStatus(`Next player: ${newGameState.currentPlayer}`);
        }
      });
    }
  }, [gameId]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        resetGame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      const timer = setInterval(() => {
        setTimerCnt((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameOver, timerCnt]);

  const renderSquare = (i) => {
    return (
      <button key={i} className="square" onClick={() => handleClick(i)}>
        {squares[i]}
      </button>
    );
  };

  return (
    <div className="container">
      {!isGameJoined ? (
        <div className="setup">
          <button onClick={handleCreateGame}>Create Game</button>
          <br />
          <div className="joinComp">
            <input
            type="text"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            placeholder="Enter Game ID"
          />
          <button onClick={handleJoinGame}>Join Game</button>
          </div>
        </div>
      ) : (
        <>
          <div className="status">{status}</div>
          <div className="grid">{squares.map((_, index) => renderSquare(index))}</div>
          {gameOver && (
            <div className="resetMessage">Game will reset in {timerCnt} seconds...</div>
          )}
        </>
      )}
    </div>
  );
};

export default TicTacToe;
