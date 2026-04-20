import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div>
            <h1>Surround your opponent's queen bee first!</h1>
            <p>Who will win?</p>
        </div>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);