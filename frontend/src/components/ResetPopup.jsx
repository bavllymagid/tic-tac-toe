import "../styles/PopupPrompt.css";

import PropTypes from 'prop-types';

const PopupPrompt = ({ isOpen, onRestart, onEnd}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <p>The other Player wants a rematch</p>
        <div className="popup-actions">
          <button className="btn-restart" onClick={onRestart}>
            Restart Game
          </button>
          <button className="btn-end" onClick={onEnd}>
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}

PopupPrompt.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRestart: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
};

export default PopupPrompt;
