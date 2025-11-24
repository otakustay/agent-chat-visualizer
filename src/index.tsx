import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '@/components/App';
import './index.css';

const rootEl = document.querySelector('#root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <Router>
                <App />
            </Router>
        </React.StrictMode>
    );
}
