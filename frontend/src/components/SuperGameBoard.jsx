import PropTypes from 'prop-types';
import '../styles/SuperGrid.css';

export const SuperGameBoard = ({ boards, onBoardSquareClick, hasTurn }) => {
  return (
    <div className="super-board">
      {boards.map((row, i) =>
        row.map((_, j) => {
          const isHighlighted = hasTurn && 
            hasTurn.innerRow === i && 
            hasTurn.innerCol === j && 
            !boards[i][j].complete && 
            hasTurn.innerRow !== -1 && 
            hasTurn.innerCol !== -1;

          return (
            <div 
              key={`${i}-${j}`}
              className={`super-grid ${isHighlighted ? 'highlighted' : ''}`}
            >
              {!boards[i][j].complete ? (
                boards[i][j].grid.map((gridRow, gridI) =>
                  gridRow.map((value, gridJ) => (
                    <button
                      key={`${gridI}-${gridJ}`}
                      className="super-square"
                      onClick={() => onBoardSquareClick(i, j, gridI, gridJ)}
                    >
                      {value}
                    </button>
                  ))
                )
              ) : (
                <div className="super-square-overlay">
                  {boards[i][j].winner}
                </div>
              )}
            </div>
          );
        })
      )}
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