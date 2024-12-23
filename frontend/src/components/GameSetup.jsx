// components/GameSetup.js
import PropTypes from 'prop-types';

export const GameSetup = ({ joinInput, onJoinInputChange, onCreateGame, onJoinGame }) => {
  return (
    <div className="setup">
      <h3>Tic Tac Toe</h3>
      <div className="enter-modes">
        <button onClick={()=>onCreateGame("super")}>Super Mode</button>
        <button onClick={()=>onCreateGame("classic")}>Classic Mode</button>
      </div>
      <br />
      <span>OR</span>
      <div className="joinComp">
        <input
          type="text"
          value={joinInput}
          onChange={(e) => onJoinInputChange(e.target.value)}
          placeholder="Enter Game ID"
        />
        <button onClick={onJoinGame}>Join Game</button>
      </div>
    </div>
  );
};

GameSetup.propTypes = {
  joinInput: PropTypes.string.isRequired,
  onJoinInputChange: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onJoinGame: PropTypes.func.isRequired
};