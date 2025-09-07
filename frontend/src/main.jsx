import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // ✅ BrowserRouter yahan import karein

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
      <App />
);