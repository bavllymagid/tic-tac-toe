// components/GameBoard.js
import PropTypes from 'prop-types';
import '../styles/GameBoard.css'

export const GameBoard = ({ grid, onSquareClick }) => {
  return (
    <div className="game-grid">
      {grid.map((row, i) =>
        row.map((value, j) => (
          <button
            key={`${i}-${j}`}
            className="game-square"
            onClick={() => onSquareClick(i, j)}
          >
            {value}
          </button>
        ))
      )}
    </div>
  );
};

GameBoard.propTypes = {
  grid: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired,
  onSquareClick: PropTypes.func.isRequired
};