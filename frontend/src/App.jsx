import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PrankScreen from './pages/PrankScreen';
import About from './pages/About';



 
 export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* Add top padding equal to navbar height (e.g., 16 = 4rem) */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Prank-Screen" element={<PrankScreen />} />
          <Route path="/About" element={<About />} />
          
          
        </Routes>
        {/* <PrankScreen /> */}
      </div>
    </BrowserRouter>
  );
}
 
    
    