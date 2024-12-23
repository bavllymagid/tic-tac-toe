import { BrowserRouter, Route, Routes } from "react-router-dom";
import TicTacToe from "../pages/TicTacToe";
import { GameRoom } from "../pages/GameRoom";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={TicTacToe} />
        <Route path="/game/:gameId/:mode" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
};
