// components/GameBoard.js
import PropTypes from 'prop-types';

export const GameBoard = ({ board, onSquareClick }) => {
  const renderSquare = (i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    return (
      <div 
        key={i} 
        className="square" 
        onClick={() => onSquareClick(row, col)}
      >
        {board[row][col]}
      </div>
    );
  };

  return (
    <div className="grid">
      {board.map((row, i) => 
        row.map((_, j) => renderSquare(i * 3 + j))
      )}
    </div>
  );
};

GameBoard.propTypes = {
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired,
  onSquareClick: PropTypes.func.isRequired
};