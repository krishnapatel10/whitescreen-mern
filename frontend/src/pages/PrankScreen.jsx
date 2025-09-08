import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import VirusAlert from '../assets/virusalert.png';
import FakeBlueScreen from "../assets/blueScreen_fullHD.gif";
import brokenscreen from "../assets/broken-screen.webp";
import FakeUpdate from "../assets/Fake Update Screen GIF.gif";
import NoiseScreen from "../assets/noise.gif";
import MatrixScreen from "../assets/matrix.gif";
import NoiseSound from "../assets/noisesound.mp3";
import FakeError from "../assets/fakeError.png"
import HackerScreen from "../assets/hacker-typer.gif"
import prank from "../assets/prank.webp";

// Prank data with URL slugs
const SIDEBAR_PRANKS = [
  { name: "Broken Screen", type: "broken", img: brokenscreen, slug: "broken-screen" },
  { name: "Hacker Screen", type: "hacker", img: HackerScreen, slug: "hacker-screen" },
  { name: "Noise Screen", type: "gps", img: NoiseScreen, slug: "noise-screen" },
];

const BOTTOM_PRANKS = [
  { name: "Fake Error", type: "error", img: FakeError, slug: "fake-error" },
  { name: "Fake Blue Screen", type: "bsod", img: FakeBlueScreen, slug: "Fake-Blue-Screen" },
  { name: "Virus Alert", type: "virus", img: VirusAlert, slug: "virus-alert" },
  { name: "Matrix Screen", type: "matrix", img: MatrixScreen, slug: "matrix-screen" },
  { name: "Fake Update", type: "update", img: FakeUpdate, slug: "fake-update" },
];

// ✅ YEH ZAROORI HAI: App.js iska istemal karega
export const ALL_PRANKS = [...SIDEBAR_PRANKS, ...BOTTOM_PRANKS];

export default function PrankScreen() {
  const [activePrank, setActivePrank] = useState(null);
  const [isFull, setIsFull] = useState(false);
  const [prankName, setPrankName] = useState("Select a Prank");
  const audioRef = useRef(null);

  const { identifier: prankSlug } = useParams();

  useEffect(() => {
    if (prankSlug) {
      const foundPrank = ALL_PRANKS.find(p => p.slug === prankSlug);
      if (foundPrank) {
        setActivePrank(foundPrank.type);
        setPrankName(foundPrank.name);
      }
    } else {
      resetPrank();
    }
  }, [prankSlug]);

  // Fullscreen detection
  useEffect(() => {
    const handleChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // Back button block in fullscreen
  useEffect(() => {
    const handlePopState = () => {
      if (isFull) {
        window.history.pushState(null, "", window.location.href);
        alert("Exit fullscreen first before leaving!");
      }
    };
    const handleBeforeUnload = (e) => {
      if (isFull) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    if (isFull) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFull]);

  // Noise sound play/stop logic
  useEffect(() => {
    if (activePrank === "gps") {
      audioRef.current.play().catch(() => {});
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [activePrank]);

  const toggleFull = () => {
    const elem = document.getElementById("preview-prank");
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const resetPrank = () => {
    setActivePrank(null);
    setPrankName("Select a Prank");
  };

  return (
    <>
      <audio ref={audioRef} src={NoiseSound} loop />
      <div className="bg-gray-300 w-full flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* ======================= */}
        {/* Sidebar (PC + Tablet/Mobile) */}
        {/* - PC (lg: breakpoint) → sidebar vertical (left side)
            - Tablet/Mobile (default flex-row) → sidebar horizontal top me show hoga */}
        {!isFull && (
          <div className="flex flex-row lg:flex-col gap-4 p-4 lg:p-6 justify-center items-center">
            {SIDEBAR_PRANKS.map((p) => (
              <Link to={`/${p.slug}`} key={p.type}>
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg cursor-pointer flex flex-col items-center justify-end transition-all duration-200">
                  {/* Image sizing PC vs Tablet/Mobile */}
                  {/* - Mobile: h-14
                      - Tablet: md:h-16
                      - PC: lg:h-20 */}
                  <img src={p.img} alt={p.name} className="w-full h-14 md:h-16 lg:h-20 object-cover rounded-2xl" />
                  <span className="text-xs font-medium mt-2 text-center text-black">{p.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ======================= */}
        {/* Main Preview */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6">
          {/* Title */}
          {!isFull && <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">{prankName}</h1>}
          
          {/* Preview Box */}
          <div
            id="preview-prank"
            onClick={toggleFull}
            className={`
              ${isFull 
                ? "w-full h-full" 
                : "w-full max-w-[600px] aspect-video md:h-[250px] lg:w-[600px] lg:h-[350px] border rounded-2xl"
              } 
              border-0 relative flex items-center justify-center`}
            style={{
              backgroundImage: `url(${activePrank ? ALL_PRANKS.find((p) => p.type === activePrank)?.img : FakeBlueScreen})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 0 40px #fcd08d"
            }}
          >
            {/* Reset Button */}
            {!isFull && (
              <div className="absolute top-4 right-4 flex gap-3 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <Link
                  to="/Prank-Screen"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-mono px-3 py-2 rounded-lg bg-white/90 cursor-pointer shadow-md hover:shadow-lg transition"
                >
                  Reset
                </Link>
              </div>
            )}

            {/* Fullscreen Button */}
            {!isFull && (
              <button onClick={(e) => { e.stopPropagation(); toggleFull(); }} className="cursor-pointer absolute bottom-4 right-4">
                <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="white">
                  <g>
                    <polygon points="29.414,26.586 22.828,20 20,22.828 26.586,29.414 24,32 32,32 32,24" />
                    <polygon points="2.586,5.414 9.172,12 12,9.172 5.414,2.586 8,0 0,0 0,8" />
                    <polygon points="26.586,2.586 20,9.172 22.828,12 29.414,5.414 32,8 32,0 24,0" />
                    <polygon points="12,22.828 9.172,20 2.586,26.586 0,24 0,32 8,32 5.414,29.414" />
                  </g>
                </svg>
              </button>
            )}

            {/* ESC Note */}
            {!isFull && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-80 text-white">
                Press ESC to exit fullscreen
              </div>
            )}
          </div>

          {/* ======================= */}
          {/* Bottom Pranks (always below preview) */}
          {/* - Mobile: small gap (mt-6)
              - Tablet: bigger gap (md:gap-6)
              - PC: large gap and sizing */}
          {!isFull && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6">
              {BOTTOM_PRANKS.map((p) => (
                <Link to={`/${p.slug}`} key={p.type}>
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg cursor-pointer flex flex-col items-center justify-end transition-all duration-200">
                    {/* Image sizing different breakpoints */}
                    <img src={p.img} alt={p.name} className="w-full h-14 md:h-16 lg:h-20 object-cover rounded-2xl" />
                    <span className="text-xs font-bold mt-2 text-center text-black">{p.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

     {/* ======================= */}
{/* Footer (same for all devices) */}
<footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-8 mt-auto">
  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
    
    {/* Left Section */}
    <div className="text-center md:text-left">
      <h2 className="text-xl font-bold text-white">WhiteScreen Tool</h2>
      <p className="text-sm text-gray-400 mt-1">
        A simple color preview & download tool.
      </p>
    </div>

    {/* Middle Links */}
    <div className="flex gap-6 text-sm font-medium">
      <a href="/" className="hover:text-white transition-colors duration-200">Home</a>
      <a href="/about" className="hover:text-white transition-colors duration-200">About</a>
      <a href="/contact" className="hover:text-white transition-colors duration-200">Contact</a>
    </div>

    {/* Right Section */}
    <div className="text-center md:text-right text-sm text-gray-400">
      <p className="mb-1">Made in India 🇮🇳</p>
      <p className="text-gray-500">© {new Date().getFullYear()} WhiteScreen Tool</p>
    </div>
  </div>
</footer>

    </>
  );
}
