import "../styles/PopupPrompt.css";
import PropTypes from 'prop-types';

const PopupPrompt = ({ isOpen, onRestart, onEnd, isRequester }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {isRequester ? (
          <h2>Waiting for the other player</h2>
        ) : (
          <h2>Other player wants to a rematch</h2>
        )}
        <div className="popup-actions">
          {!isRequester && (
            <button className="btn-restart" onClick={onRestart}>
              Rematch
            </button>
          )}
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
  isRequester: PropTypes.bool.isRequired,
};

export default PopupPrompt;