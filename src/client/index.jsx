import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div>
            <h1>HexyComb React Client Loaded</h1>
            <p>React is working!</p>
        </div>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);