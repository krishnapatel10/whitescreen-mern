import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

// Components
import Home, { ALL_COLORS } from "./pages/Home.jsx";
import PrankScreen, { ALL_PRANKS } from './pages/PrankScreen';
import About from './pages/About';
import Contact from './pages/Contact.jsx';

// Helper
import tinycolor from 'tinycolor2';

// ✅ YEH HAI AAPKA SMART COMPONENT, BINA ALAG FILE BANAYE
// Yeh component decide karega ki URL ke hisaab se kya dikhana hai.
const UrlIdentifier = () => {
  const { identifier } = useParams();

  // 1. Check karein ki kya identifier ek Prank hai
  const isPrank = ALL_PRANKS.some(p => p.slug === identifier);
  if (isPrank) {
    return <PrankScreen />; // PrankScreen dikhayein
  }

  // 2. Check karein ki kya identifier ek Color hai
  const isColor =
    ALL_COLORS.some(c => c.slug === identifier) ||
    tinycolor(identifier).isValid();
  
  if (isColor) {
    return <Home />; // Home page dikhayein
  }

  // 3. Agar kuch na mile, to default Home page dikhayein
  return <Home />;
}


export default function App() {
  return (
    // ✅ BrowserRouter yahan se hata diya gaya hai
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* 1. Pehle specific (fixed) routes aayenge */}
          <Route path="/" element={<Home />} />
          <Route path="/Prank-Screen" element={<PrankScreen />} />
          <Route path="/About" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
          
          
          {/* 2. ✅ Final Smart "Catch-all" route (sabse aakhir mein) */}
          {/* Yeh /red-screen, /broken-screen, etc. sabko handle karega */}
          <Route path="/:identifier" element={<UrlIdentifier />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}