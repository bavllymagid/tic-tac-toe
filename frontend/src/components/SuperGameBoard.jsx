import PropTypes from 'prop-types';
import { GameBoard } from './GameBoard';
import '../styles/SuperGrid.css';

export const SuperGameBoard = ({ boards, onBoardSquareClick, hasTurn }) => {

  const renderSmallGrid = (i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;

    // Determine if this grid should be highlighted
    const isHighlighted = hasTurn && 
      hasTurn.innerRow === row && 
      hasTurn.innerCol === col && 
      !boards[row][col].complete
      && hasTurn.innerRow !== -1 && 
      hasTurn.innerCol !== -1;

      // console.log(hasTurn.row, hasTurn.column, row, col, isHighlighted);
    return (
      <div 
        key={i} 
        className={`small-grid ${isHighlighted ? 'highlighted' : ''}`}
      >
        {!boards[row][col].complete ? (
          <GameBoard 
            grid={boards[row][col].grid} 
            onSquareClick={(subRow, subCol) => onBoardSquareClick(row, col, subRow, subCol)} 
          />
        ) : (
          <div className="small-grid-overlay">{boards[row][col].winner}</div>
        )}
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
      PropTypes.shape({
        grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
        complete: PropTypes.bool,
        winner: PropTypes.string
      })
    )
  ).isRequired,
  onBoardSquareClick: PropTypes.func.isRequired,
  hasTurn: PropTypes.shape({
    innerRow: PropTypes.number,
    innerCol: PropTypes.number
  })
};