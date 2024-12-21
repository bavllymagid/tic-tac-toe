// gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grid: Array(3).fill(Array(3).fill("")),
  status: "",
  winner: "",
  isDraw: false,
  currentTurn: "",
  playerSymbol: "",
  hasJoinedGame: false,
};

const gameSlice = createSlice({
  name: 'TicTacToe',
  initialState,
  reducers: {
    updateBoard: (state, action) => {
      state.grid = action.payload;
    },
    setGameStatus: (state, action) => {
      state.status = action.payload;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    setDraw: (state, action) => {
      state.isDraw = action.payload;
    },
    setCurrentTurn: (state, action) => {
      state.currentTurn = action.payload;
    },
    setPlayerSymbol: (state, action) => {
      state.playerSymbol = action.payload;
    },
    setHasJoinedGame: (state, action) => {
      state.hasJoinedGame = action.payload;
    },
    resetGameState: () => {
      return initialState;
    },
    updateGameState: (state, action) => {
      const gameState = action.payload;
      state.grid = gameState.board;
      state.winner = gameState.winner;
      state.currentTurn = gameState.currentPlayer;
      state.isDraw = gameState.draw;
      if(state.isDraw) {
        state.status = 'Draw';
      }
      else if (state.winner == "") {
        if (gameState.currentPlayer === state.playerSymbol) {
          state.status = 'Your turn';
        } else {
          state.status = 'Waiting for other player move';
        }
      } else {
        if (state.winner == state.playerSymbol) {
          state.status = 'You win';
        } else {
          state.status = 'You lose';
        }
      }
    },
  },
});

export const {
  updateBoard,
  setGameStatus,
  setWinner,
  setDraw,
  setCurrentTurn,
  setPlayerSymbol,
  resetGameState,
  updateGameState,
  setHasJoinedGame,
} = gameSlice.actions;

export default gameSlice.reducer;