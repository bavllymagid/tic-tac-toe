// components/GameBoard.js
import PropTypes from 'prop-types';

export const GameBoard = ({ grid, onSquareClick }) => {
  const renderSquare = (i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    return (
      <div 
        key={i} 
        className="square" 
        onClick={() => onSquareClick(row, col)}
      >
        {grid[row][col]}
      </div>
    );
  };

  return (
    <div className="grid">
      {grid.map((row, i) => 
        row.map((_, j) => renderSquare(i * 3 + j))
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