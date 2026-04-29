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
            <PremiumModal 
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </div>
    );
};

export default App;
