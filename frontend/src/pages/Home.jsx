import React from 'react';
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import tinycolor from 'tinycolor2';

// Predefined color lists
const COLORS = [
  { name: "Yellow Screen", value: "#FFFF00", slug: "yellow-screen" },
  { name: "Orange Screen", value: "#FFA500", slug: "orange-screen" },
  { name: "Pink Screen", value: "#FFC0CB", slug: "pink-screen" },
  { name: "Purple Screen", value: "#800080", slug: "purple-screen" },
  { name: "Zoom Lighting", value: "#FFE4B5", slug: "zoom-lighting" },
];

const BOTTOM_COLORS = [
  { name: "White Screen", value: "#FFFFFF", slug: "white-screen" },
  { name: "Black Screen", value: "#000000", slug: "black-screen" },
  { name: "Red Screen", value: "#FF0000", slug: "red-screen" },
  { name: "Green Screen", value: "#00FF00", slug: "green-screen" },
  { name: "Blue Screen", value: "#0000FF", slug: "blue-screen" },
];

export const ALL_COLORS = [...COLORS, ...BOTTOM_COLORS];

export default function Home() {
  const [color, setColor] = useState("#FFFFFF");
  const [customHex, setCustomHex] = useState("#FFFFFF");
  const [isFull, setIsFull] = useState(false);
  const [colorName, setColorName] = useState("White Screen");
  const [resolution, setResolution] = useState("1080p");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  const navigate = useNavigate();
  const location = useLocation();
  const { identifier } = useParams();

  // ---------- Handle initial color from URL ----------
  useEffect(() => {
    let colorSet = false;
    const urlIdentifier = identifier || (location.pathname === '/' ? 'white-screen' : '');
    if (urlIdentifier) {
      const foundColor = ALL_COLORS.find(c => c.slug === urlIdentifier);
      if (foundColor) {
        setColor(foundColor.value);
        setColorName(foundColor.name);
        setCustomHex(foundColor.value);
        colorSet = true;
      } else {
        const colorObj = tinycolor(urlIdentifier);
        if (colorObj.isValid()) {
          const hex = colorObj.toHexString();
          setColor(hex);
          setCustomHex(hex);
          setColorName(urlIdentifier);
          colorSet = true;
        }
      }
    }
    if (!colorSet) {
      const whiteScreen = ALL_COLORS.find(c => c.slug === 'white-screen');
      if (whiteScreen) {
        setColor(whiteScreen.value);
        setColorName(whiteScreen.name);
        setCustomHex(whiteScreen.value);
      }
    }
  }, [identifier, location.pathname]);

  // ---------- Sync URL with color ----------
  useEffect(() => {
    if (location.pathname === '/' && colorName === 'White Screen') return;
    const timer = setTimeout(() => {
      let targetUrl = '';
      const predefinedColor = ALL_COLORS.find(c => tinycolor.equals(c.value, color));
      if (predefinedColor && predefinedColor.name === colorName) {
        targetUrl = `/${predefinedColor.slug}`;
      } else {
        const userInput = customHex.trim().replace('#', '');
        if (userInput && tinycolor(userInput).isValid()) {
          targetUrl = `/${userInput}`;
        }
      }
      if (targetUrl && targetUrl !== location.pathname) {
        navigate(targetUrl, { replace: true });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [color, colorName, customHex, navigate, location.pathname]);

  // ---------- Fullscreen detection ----------
  useEffect(() => {
    const handleChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ---------- Prevent leaving in fullscreen ----------
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

  const downloadImage = () => {
    let width = 1920; let height = 1080;
    if (resolution === "480p") { width = 854; height = 480; }
    else if (resolution === "720p") { width = 1280; height = 720; }
    else if (resolution === "1080p") { width = 1920; height = 1080; }
    else if (resolution === "1440p") { width = 2560; height = 1440; }
    else if (resolution === "2160p") { width = 3840; height = 2160; }
    else if (resolution === "4320p") { width = 7680; height = 4320; }
    else if (resolution === "custom") {
      width = Number(customWidth) || 1920;
      height = Number(customHeight) || 1080;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    const link = document.createElement("a");
    link.download = `${colorName.replace(/ /g, "_")}_${width}x${height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCustomColorChange = (newValue) => {
    setCustomHex(newValue);
    const colorObj = tinycolor(newValue);
    if (colorObj.isValid()) setColor(colorObj.toHexString());
    if (!newValue.startsWith('#')) setColorName(newValue);
    else setColorName("Custom Color");
  };

  return (
    <>
      <div className="bg-gray-300 w-full min-h-screen flex flex-col">
        {/* ---------- Container: Mobile=column, Tablet=column, PC=row ---------- */}
        <div className="w-full flex-1 flex flex-col md:flex-col lg:flex-row lg:max-w-7xl lg:mx-auto items-center justify-center md:items-center md:justify-center">

          {/* ---------- Main Preview ---------- */}
          <div className="order-1 lg:order-2 flex-1 flex flex-col  items-center justify-center p-4 lg:p-6 relative cursor-pointer text-white">
            {!isFull && <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 text-black text-center">{colorName}</h1>}
            <div id="preview" onClick={toggleFull} className={`${isFull ? "w-full h-full" : "w-full aspect-video md:aspect-auto md:h-[250px] max-w-[600px] lg:w-[600px] lg:h-[350px] border rounded-2xl"} relative flex items-center border-0 justify-center`} style={{ backgroundColor: color, boxShadow: "0 0 40px #fcd08d" }}>
              {!isFull && (
                <>
                  <div className="absolute top-4 right-4 flex gap-3 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-md">
                    <Link to="/" onClick={(e) => e.stopPropagation()} className="text-sm font-mono px-3 py-2 rounded-lg bg-white/90 text-black cursor-pointer shadow-md hover:shadow-lg transition">Reset</Link>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFull(); }} className="cursor-pointer absolute bottom-4 right-4">
                    <svg height="32" width="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill={tinycolor(color).isDark() ? "white" : "black"}>
                      <g><polygon points="29.414,26.586 22.828,20 20,22.828 26.586,29.414 24,32 32,32 32,24" /><polygon points="2.586,5.414 9.172,12 12,9.172 5.414,2.586 8,0 0,0 0,8" /><polygon points="26.586,2.586 20,9.172 22.828,12 29.414,5.414 32,8 32,0 24,0" /><polygon points="12,22.828 9.172,20 2.586,26.586 0,24 0,32 8,32 5.414,29.414" /></g>
                    </svg>
                  </button>
                  <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-80 ${tinycolor(color).isDark() ? "text-white" : "text-black"}`}>Press ESC to exit fullscreen</div>
                </>
              )}
            </div>

            {/* ---------- Bottom Colors ---------- */}
            {!isFull && (
              <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-6">
                {BOTTOM_COLORS.map((c) => (
                  <Link to={`/${c.slug}`} key={c.name} title={c.name}>
                    <div className={`w-24 h-16 lg:w-28 lg:h-20 rounded-lg cursor-pointer flex items-center text-center justify-center transition-all duration-200 ${color === c.value ? "shadow-2xl ring-2 ring-yellow-700" : "shadow-md hover:shadow-lg"}`} style={{ backgroundColor: c.value }}>
                      <span className={`text-sm font-bold p-1 ${tinycolor(c.value).isDark() ? "text-white" : "text-black"}`}>{c.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Left Sidebar ---------- */}
          {!isFull && (
            <div className="order-2 lg:order-1 p-4 flex lg:flex-col flex-row flex-wrap justify-center items-center gap-4 lg:p-6 lg:space-y-4 md:mt-6">
              {COLORS.map((c) => (
                <Link to={`/${c.slug}`} key={c.name} title={c.name}>
                  <div className={`w-24 h-16 lg:w-28 lg:h-20 rounded-lg cursor-pointer flex items-center justify-center text-center transition-all duration-200 ${color === c.value ? "shadow-2xl ring-2 ring-yellow-700" : "shadow-md hover:shadow-lg"}`} style={{ backgroundColor: c.value }}>
                    <span className={`text-sm font-bold p-1 ${tinycolor(c.value).isDark() ? "text-white" : "text-black"}`}>{c.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ---------- Right Controls ---------- */}
          {!isFull && (
            <div className="order-3 lg:order-3 w-full lg:w-auto max-w-sm mx-auto lg:mx-0 p-6 flex flex-col space-y-4">
              <label className="font-semibold">Resolution</label>
              <select className="border p-2 cursor-pointer rounded " value={resolution} onChange={(e) => setResolution(e.target.value)}>
                <option value="480p">480p</option><option value="720p">720p</option><option value="1080p">1080p</option><option value="1440p">1440p 2K</option><option value="2160p">2160p 4K</option><option value="4320p">4320p 8K</option><option value="custom">Custom</option>
              </select>
              {resolution === "custom" && (
                <>
                  <div className="flex items-center space-x-2"><input type="number" className="border p-2 w-24 rounded" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} placeholder="1920" /><span>px</span></div>
                  <div className="flex items-center space-x-2"><input type="number" className="border p-2 w-24 rounded" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} placeholder="1080" /><span>px</span></div>
                </>
              )}
              <button onClick={downloadImage} className=" bg-gray-200 cursor-pointer hover:bg-gray-300 p-2 rounded shadow">Download</button>
              <div className="flex items-center space-x-2">
                <input type="color" value={color} onChange={(e) => handleCustomColorChange(e.target.value)} className="w-12 h-10 cursor-pointer" />
                <input type="text" value={customHex} onChange={(e) => handleCustomColorChange(e.target.value)} className="border p-2 flex-1 w-full rounded" placeholder="Hex or Name..." />
              </div>
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
