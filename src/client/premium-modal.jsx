import React from 'react';

const PremiumModal = ({ visible, onClose }) => {
    if (!visible) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <h2>Premium Required</h2>
                <p>You must be a Premium Member to play online.</p>

                <div className="modal-buttons">
                    <button onClick={onClose}>Close</button>
                    <a href="/premium" className="button-link">Upgrade to Premium</a>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
