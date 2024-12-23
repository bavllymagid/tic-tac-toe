// gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grid: Array(3).fill(Array(3).fill("")),
  superGrid: Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => ({
      grid: Array.from({ length: 3 }, () => Array(3).fill("")),
      winner: null,
      isComplete: false,
    }))
  ),  
  status: "",
  winner: null,
  isDraw: false,
  currentTurn: "",
  playerSymbol: "",
  lastMove: {
    row: -1,
    col: -1,
    subRow: -1,
    subCol: -1,
  },
  isPopupOpen: false,
  isRequester: false,
  mode: "",
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
    setIsPopupOpen: (state, action) => {
      state.isPopupOpen = action.payload;
    },
    setIsRequester: (state, action) => {
      state.isRequester = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    resetGameState: () => {
      return initialState;
    },
    updateGameState: (state, action) => {
      const gameState = action.payload;
      state.grid = gameState.board[0][0].grid;
      state.superGrid = gameState.board;
      console.log("game super", gameState.board);
      state.winner = gameState.winner;
      state.currentTurn = gameState.currentPlayer;
      state.isDraw = gameState.draw;
      state.lastMove = gameState.lastMove;
      if(state.isDraw) {
        state.status = 'Draw';
      }
      else if (state.winner == null) {
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
  setIsPopupOpen,
  setIsRequester,
  setMode
} = gameSlice.actions;

export default gameSlice.reducer;