import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';

const CelebDisplay = ({ duration = 15, colors = ["#bb0000", "#ffffff"] }) => {
    const [isActive, setIsActive] = useState(true);

    const animate = useCallback(() => {
        const end = Date.now() + duration * 1000;

        const frame = () => {
            // Left side confetti
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });

            // Right side confetti
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                setIsActive(false);
            }
        };

        // Start the animation
        frame();
    }, [duration, colors]);

    useEffect(() => {
        if (isActive) {
            animate();
        }

        // Cleanup function
        return () => {
            setIsActive(false);
        };
    }, [isActive, animate]);

    // The component doesn't need to render anything visible
    return null;
};

CelebDisplay.propTypes = {
    duration: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string)
};

export default CelebDisplay;