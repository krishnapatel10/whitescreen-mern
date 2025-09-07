import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from "./pages/Home.jsx"; // Apne Home component ko import karein
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
         {/* Naya route custom hex codes ke liye */}
    <Route path="/custom/:customHex" element={<Home />} />

    {/* ✅ Naya route color names ke liye */}
    <Route path="/color/:colorName" element={<Home />} />
    
    {/* Purana route, jo root (/) aur color slugs (red-screen) dono ko handle karega */}
    <Route path="/:colorSlug?" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);