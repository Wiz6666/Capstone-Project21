import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Import global styles if you have them
import App from './App';  // Import the main App component
import 'bootstrap/dist/css/bootstrap.min.css';

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
