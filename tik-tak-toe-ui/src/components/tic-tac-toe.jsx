import { useState, useEffect } from "react";
import { connectToWebSocket, processMove, wsJoinGame, disconnectWebSocket} from "../utils/webSocket";
import { createGame, joinGame, endGame } from "../utils/api";
import "../styles/tic-tac-toe.css";

const TicTacToe = () => {
  const [grid, setGrid] = useState(Array(3).fill(Array(3).fill("")));
  const [status, setStatus] = useState("");
  const [winner, setWinner] = useState("");
  const [timerCnt, setTimerCnt] = useState(3);
  const [gameId, setGameId] = useState(null);
  const [isGameJoined, setIsGameJoined] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [player, setPlayer] = useState("");
  const [currentTurn, setCurrentTurn] = useState("");
  const [isDraw, setIsDraw] = useState(false);

  // Handle user moves
  const handleClick = (row,col) => {
    if (winner || grid[row][col] || currentTurn !== player) {
      console.log(winner, grid[row][col], currentTurn, player);
      console.log(`Invalid move in game ${gameId}`);
      return;
    }
    // Send the move to the server
    console.log(`Processing move in game ${gameId} with coordinates: (${row}, ${col})`);
    processMove(gameId, row, col);
  };

  // Reset game state
  const resetGame = () => {
    setWinner(null);
    setIsDraw(false);
    setTimerCnt(4);
    setCurrentTurn("");
    setIsGameJoined(false);
    setJoinInput("");
    setGrid(Array(3).fill(Array(3).fill("")));
    if (gameId) {
      endGame(gameId).catch((error) => console.error("Failed to end game:", error));
      setGameId(null);
    }
    disconnectWebSocket();
  };

  // Decide the winner status
  const decideWinner = (winner, isDraw) => {
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
  
      const timeout = setTimeout(() => {
        clearInterval(interval);
        resetGame();
      }, 3000);
  
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  };

  // Update game state
  const setState = (gameState) => {
    setGrid(gameState.board);
        setWinner(gameState.winner);
        setCurrentTurn(gameState.currentPlayer);
        setIsDraw(gameState.draw);
        if(gameState.currentPlayer == player )
          setStatus(`Player ${gameState.currentPlayer} Turn`)
        else 
          setStatus("Waiting for player...");
        console.log("Game state updated:", gameState);
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
      console.log("Game joined:", gameId);

    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      connectToWebSocket(gameId,
         (gameState) => {
          setState(gameState);
          decideWinner(gameState.winner, gameState.draw);
      }, () => {
        wsJoinGame(gameId);
      });
    }
  }, [gameId]);


  const renderSquare = (i) => {
    return (
      <div key={i} className="square" onClick={() => handleClick(Math.floor(i / 3), i % 3)}>
        {grid[Math.floor(i / 3)][i % 3]}
      </div>
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
          <div className="gameId">
            Game ID: <span className="gameIdText">{gameId}</span>
          </div>
          <div className="status">{status}</div>
          <div className="grid">{grid.map((row, i) => row.map((_, j) => renderSquare(i * 3 + j)))}</div>
          {(winner != "" || isDraw )&& (
            <div className="resetMessage">Game will reset in {timerCnt} seconds...</div>
          )}
          <div className="status"> Player : {player}</div>
        </>
      )}
    </div>
  );
};

export default TicTacToe;