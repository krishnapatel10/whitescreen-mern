import React from 'react'
import { useState, useEffect } from "react";

// COLORS and BOTTOM_COLORS arrays remain the same...
const COLORS = [
  { name: "Yellow Screen", value: "#FFFF00" },
  { name: "Orange Screen", value: "#FFA500" },
  { name: "Pink Screen", value: "#FFC0CB" },
  { name: "Purple Screen", value: "#800080" },
  { name: "Zoom Lighting", value: "#FFE4B5" },
];

const BOTTOM_COLORS = [
  { name: "White Screen", value: "#FFFFFF" },
  { name: "Black Screen", value: "#000000" },
  { name: "Red Screen", value: "#FF0000" },
  { name: "Green Screen", value: "#00FF00" },
  { name: "Blue Screen", value: "#0000FF" },
];

export default function Home() {
  const [color, setColor] = useState("#FFFFFF");
  const [customHex, setCustomHex] = useState("#FFFFFF");
  const [isFull, setIsFull] = useState(false);
  const [colorName, setColorName] = useState("White Screen");

  const [resolution, setResolution] = useState("1080p");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  // ✅ Fullscreen detection
  useEffect(() => {
    const handleChange = () => {
      setIsFull(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ✅ Block back button & tab close in fullscreen
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

  const toggleFull = () => {
    const elem = document.getElementById("preview");
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const resetColor = () => {
    setColor("#FFFFFF");
    setCustomHex("#FFFFFF");
    setColorName("White Screen");
  };

  // ✅ DOWNLOAD FUNCTION
  const downloadImage = () => {
    let width = 1920;
    let height = 1080;

    if (resolution === "480p") {
      width = 854; height = 480;
    } else if (resolution === "720p") {
      width = 1280; height = 720;
    } else if (resolution === "1080p") {
      width = 1920; height = 1080;
    } else if (resolution === "1440p") {
      width = 2560; height = 1440;
    } else if (resolution === "2160p") {
      width = 3840; height = 2160;
    } else if (resolution === "4320p") {
      width = 7680; height = 4320;
    } else if (resolution === "custom") {
      width = Number(customWidth) || 1920;
      height = Number(customHeight) || 1080;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    const link = document.createElement("a");
    link.download = `${colorName.replace(/ /g, "_")}_${width}x${height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      <div className="bg-gray-300 w-full flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        {!isFull && (
          <div className="relative top-7 left-45 z-2 p-6 space-y-4 gap-6 mt-10">
            {COLORS.map((c) => (
              <div
                key={c.name}
                onClick={() => {
                  setColor(c.value);
                  setColorName(c.name);
                }}
                className={`w-28 h-20 rounded-lg cursor-pointer flex items-center justify-center 
                transition-all duration-200 
                ${color === c.value
                    ? "shadow-2xl ring-2 ring-yellow-700"
                    : "shadow-md hover:shadow-lg"
                  }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              >
                <span
                  className={`text-sm font-bold  ${c.value === "#000000" ? "text-white" : "text-black"
                    }`}
                >
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Preview */}
        <div className="flex-1 flex flex-col items-center justify-start p-6 relative cursor-pointer">
          {!isFull && <h1 className="text-4xl font-bold mb-6">{colorName}</h1>}

          <div
            id="preview"
            onClick={toggleFull}
            className={`${isFull ? "w-full h-full" : "w-[600px] h-[350px] border rounded-2xl"} relative flex items-center border-0 justify-center`}
            style={{
              backgroundColor: color,
              boxShadow: "0 0 40px #fcd08d"
                          
            }}
          >
            {/* Controls */}
            {!isFull && (
              <div className="absolute top-4 right-4 flex gap-3 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetColor();
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
                className="cursor-pointer absolute bottom-4 right-4"
              >
                <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill={color === "#000000" ? "white" : "black"}>
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
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-80 ${color === "#000000" ? "text-white" : "text-black"}`}>
                Press ESC to exit fullscreen
              </div>
            )}
          </div>

          {/* Bottom Colors */}
          {!isFull && (
            <div className="flex gap-6 mt-10">
              {BOTTOM_COLORS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => {
                    setColor(c.value);
                    setColorName(c.name);
                  }}
                  className={`w-28 h-20 rounded-lg cursor-pointer flex items-center justify-center 
                    transition-all duration-200 
                    ${color === c.value
                      ? "shadow-2xl ring-2 ring-yellow-700"
                      : "shadow-md hover:shadow-lg"
                    }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  <span className={`text-sm font-bold ${c.value === "#000000" ? "text-white" : "text-black"}`}>
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        {!isFull && (
          <div className="z-1 relative right-35 top-25 w-1/5 p-6 flex flex-col space-y-4">
            <label className="font-semibold">Resolution</label>
            <select className="border p-2 rounded" value={resolution} onChange={(e) => setResolution(e.target.value)}>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="1440p">1440p 2K</option>
              <option value="2160p">2160p 4K</option>
              <option value="4320p">4320p 8K</option>
              <option value="custom">Custom</option>
            </select>

            {resolution === "custom" && (
              <>
                <div className="flex items-center space-x-2">
                  <input type="number" className="border p-2 w-24 rounded" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} placeholder="1920"/>
                  <span>px</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="number" className="border p-2 w-24 rounded" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} placeholder="1080"/>
                  <span>px</span>
                </div>
              </>
            )}

            <button onClick={downloadImage} className="bg-gray-200 hover:bg-gray-300 p-2 rounded shadow">Download</button>

            {/* 🎨 Custom Picker */}
            <div className="flex items-center space-x-2">
              <input type="color" value={customHex} onChange={(e) => {
                setCustomHex(e.target.value);
                setColor(e.target.value);
                setColorName("Custom Color");
              }} className="w-12 h-10 cursor-pointer"/>
              <input type="text" value={customHex} onChange={(e) => {
                setCustomHex(e.target.value);
                setColor(e.target.value);
                setColorName("Custom Color");
              }} className="border p-2 w-28 rounded"/>
            </div>
          </div>
        )}
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
