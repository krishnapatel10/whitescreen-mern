// File: src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import PrankScreen from './pages/PrankScreen';
import About from './pages/About';

export default function App() {
  return (
    // ✅ CHANGE: BrowserRouter ab poori application ko yahan wrap karega.
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* 1. Pehle specific routes aayenge */}
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />

          <Route path="/Prank-Screen" element={<PrankScreen />} />
          
          {/* PrankScreen ke liye base aur dynamic route */}
          <Route path="/Prank-Screen/:prankSlug?" element={<PrankScreen />} />

          {/* 2. ✅ CHANGE: Yeh dynamic route sabse AAKHIR mein aayega */}
          {/* Yeh /red-screen, /ff0000, aur /tomato jaise sabhi color URLs ko pakad lega */}
          <Route path="/:colorIdentifier" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}