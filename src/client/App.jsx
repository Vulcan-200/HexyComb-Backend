import React, { useState } from 'react';
import PremiumModal from './premium-modal';

const App = () => {
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Unity will call this function
    window.showPremiumModal = () => {
        setShowPremiumModal(true);
    };

    return (
        <div>
            <h1>Surround your opponent's queen bee first!</h1>
            <p>Who will win?</p>

            <PremiumModal 
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </div>
    );
};

export default App;
