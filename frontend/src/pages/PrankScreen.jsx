import React, { useState, useEffect, useRef } from "react";
import VirusAlert from '../assets/virusalert.png';
import BlueScreen from "../assets/blueScreen_fullHD.gif";
import brokenscreen from "../assets/broken-screen.webp";
import FakeUpdate from "../assets/Fake Update Screen GIF.gif";
import NoiseScreen from "../assets/noise.gif";
import MatrixScreen from "../assets/matrix.gif";
import NoiseSound from "../assets/noisesound.mp3";  // ✅ noise sound
import FakeError from "../assets/fakeError.png"
import HackerScreen from "../assets/hacker-typer.gif"

//rest image
import prank from "../assets/prank.webp";

// ✅ Left Sidebar Pranks
const SIDEBAR_PRANKS = [
  { name: "Broken Screen", type: "broken", img: brokenscreen },
  { name: "Hacker Screen", type: "hacker", img: HackerScreen },
  { name: "Noise Screen", type: "gps", img: NoiseScreen },
];

// ✅ Bottom Pranks (the rest)
const BOTTOM_PRANKS = [
  { name: "Fake Error", type: "error", img: FakeError },
  { name: "Blue Screen (BSOD)", type: "bsod", img: BlueScreen },
  { name: "Virus Alert", type: "virus", img: VirusAlert },
  { name: "Matrix Screen", type: "matrix", img: MatrixScreen },
  { name: "Fake Update", type: "update", img: FakeUpdate },
];

export default function PrankScreen() {
  const [activePrank, setActivePrank] = useState(null);
  const [isFull, setIsFull] = useState(false);
  const [prankName, setPrankName] = useState("Select a Prank");
  const audioRef = useRef(null);

  // ✅ Fullscreen detection
  useEffect(() => {
    const handleChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ✅ Block back button in fullscreen
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

  // ✅ Noise sound play/stop logic
  useEffect(() => {
    if (activePrank === "gps") {
      audioRef.current.play().catch(() => { });
    } else {
      if (audioRef.current) {
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
      {/* ✅ Hidden audio element */}
      <audio ref={audioRef} src={NoiseSound} loop />

      <div className="bg-gray-300 w-full flex h-screen overflow-hidden">

        {/* Left Sidebar */}
        {!isFull && (
          <div className="flex z-1 relative left-40 top-15 flex-col gap-6 p-6">
            {SIDEBAR_PRANKS.map((p) => (
              <div
                key={p.type}
                onClick={() => {
                  setActivePrank(p.type);
                  setPrankName(p.name);
                }}
                className={`w-28 h-28 rounded-lg cursor-pointer flex flex-col items-center justify-end transition-all duration-200`}
              >
                <img src={p.img} alt={p.name} className="w-full h-20 object-cover rounded-2xl" />
                <span className="text-xs font-medium mt-2 text-center text-black">{p.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Preview */}
        <div className="flex-1 flex flex-col items-center justify-start p-6 relative right-38 cursor-pointer">
          {!isFull && <h1 className="text-4xl font-bold mb-6">{prankName}</h1>}

          <div
            id="preview-prank"
            onClick={toggleFull}
            className={`${isFull ? "w-full h-full" : "w-[600px] h-[350px] border rounded-2xl"} border-0 relative flex items-center justify-center`}
            style={{
              backgroundImage: `url(${activePrank
                ? [...SIDEBAR_PRANKS, ...BOTTOM_PRANKS].find((p) => p.type === activePrank)?.img
                : prank // rest image
                })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 0 40px #fcd08d"
            }}
          >
            {/* Reset Button */}
            {!isFull && (
              <div className="absolute top-4 right-4 flex gap-3 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetPrank();
                  }}
                  className="text-sm font-mono px-3 py-2 rounded-lg bg-white/90 cursor-pointer shadow-md hover:shadow-lg transition"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Fullscreen Button */}
            {!isFull && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFull();
                }}
                className="cursor-pointe absolute bottom-4 right-4"
              >
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

            {!isFull && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-80 text-white">
                Press ESC to exit fullscreen
              </div>
            )}
          </div>

          {/* Bottom Pranks */}
          {!isFull && (
            <div className="flex gap-6 mt-10">
              {BOTTOM_PRANKS.map((p) => (
                <div
                  key={p.type}
                  onClick={() => {
                    setActivePrank(p.type);
                    setPrankName(p.name);
                  }}
                  className={`w-28 h-28 rounded-lg cursor-pointer flex flex-col items-center justify-end transition-all duration-200`}
                >
                  <img src={p.img} alt={p.name} className="w-full h-20 object-cover rounded-2xl" />
                  <span className="text-xs font-bold mt-2 text-center text-black">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-white">WhiteScreen Tool</h2>
            <p className="text-sm text-gray-400">A simple color preview & download tool built with React + Tailwind CSS.</p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/about" className="hover:text-white">About</a>
            <a href="/contact" className="hover:text-white">Contact</a>
            <a href="/support" className="hover:text-white">Support</a>
          </div>

          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>Made in India 🇮🇳</p>
            <p>© {new Date().getFullYear()} WhiteScreen Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
