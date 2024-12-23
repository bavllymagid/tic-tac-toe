import PropTypes from 'prop-types';
import { GameBoard } from './GameBoard';
import '../styles/SuperGrid.css';

export const SuperGameBoard = ({ boards, onBoardSquareClick }) => {

  const renderSmallGrid = (i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;

    return (
      <div key={i} className="small-grid">
        <GameBoard 
          grid={boards[row][col].grid} 
          onSquareClick={(subRow, subCol) => onBoardSquareClick(row, col, subRow, subCol)} 
        />
      </div>
    );
  };

  return (
    <div className="mega-grid">
      {Array.from({ length: 9 }, (_, i) => renderSmallGrid(i))}
    </div>
  );
};

SuperGameBoard.propTypes = {
    boards: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    )
  ).isRequired,
  onBoardSquareClick: PropTypes.func.isRequired,
};
