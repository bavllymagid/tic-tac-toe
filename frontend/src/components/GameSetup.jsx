// components/GameSetup.js
import PropTypes from 'prop-types';

export const GameSetup = ({ joinInput, onJoinInputChange, onCreateGame, onJoinGame }) => {
  return (
    <div className="setup">
      <button onClick={onCreateGame}>Create Game</button>
      <br />
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