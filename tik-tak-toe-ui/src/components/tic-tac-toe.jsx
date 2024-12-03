import { useState, useEffect } from "react";
import { connectToWebSocket, processMove, wsJoinGame} from "../utils/webSocket"; // WebSocket helpers
import { createGame, joinGame, endGame } from "../utils/api"; // API helpers
import "../styles/tic-tac-toe.css";

const TicTacToe = () => {
  const [grid, setGrid] = useState(Array(3).fill(Array(3).fill("")));
  const [status, setStatus] = useState("Waiting for player...");
  const [gameOver, setGameOver] = useState(false);
  const [timerCnt, setTimerCnt] = useState(3);
  const [gameId, setGameId] = useState(null);
  const [isGameJoined, setIsGameJoined] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [player, setPlayer] = useState("Waiting for opponent...");
  const [currentTurn, setCurrentTurn] = useState(null); // Tracks whose turn it is

  // Handle user moves
  const handleClick = (row,col) => {
    if (gameOver || grid[row][col] || currentTurn !== player) {
      console.log(gameOver, grid[row][col], currentTurn, player);
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    // Send the move to the server
    processMove(gameId, row, col);
    // Switch the turn to the opponent
    setCurrentTurn(player === "X" ? "O" : "X");
    setStatus(player === "X" ? "Next player: O" : "Next player: X");
  };

  // Reset game state
  const resetGame = () => {
    setStatus("player: X");
    setGameOver(false);
    setTimerCnt(3);
    setCurrentTurn(null);
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
      setPlayer(game.player1.charAt(game.player1.length - 1));
      console.log("Game created:", gameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  // Join an existing game
  const handleJoinGame = async () => {
    try {
      const game = await joinGame(joinInput);
      setGameId(game.gameId);
      setIsGameJoined(true);
      setPlayer(game.player2.charAt(game.player2.length - 1));
      setCurrentTurn("X");
      setStatus(`Player ${currentTurn} Turn`);
      console.log("Game joined:", gameId);

    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      connectToWebSocket(gameId,
         (gameState) => {
        setGrid(gameState.board);
        setGameOver(gameState.gameOver);
        setCurrentTurn(gameState.currentPlayer);
        setStatus(`Player ${currentTurn} Turn`)
        console.log("Game state updated:", gameState);
      }, () => {
        wsJoinGame(gameId);
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
        {grid[Math.floor(i / 3)][i % 3]}
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
          <div className="grid">{grid.map((row, i) => row.map((_, j) => renderSquare(i * 3 + j)))}</div>
          {gameOver && (
            <div className="resetMessage">Game will reset in {timerCnt} seconds...</div>
          )}
          <div className="status"> Player : {player}</div>
        </>
      )}
    </div>
  );
};

export default TicTacToe;