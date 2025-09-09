import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import tinycolor from "tinycolor2";
import "./Home.css";

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
    const urlIdentifier = identifier || (location.pathname === "/" ? "white-screen" : "");
    if (urlIdentifier) {
      const foundColor = ALL_COLORS.find((c) => c.slug === urlIdentifier);
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
      const whiteScreen = ALL_COLORS.find((c) => c.slug === "white-screen");
      if (whiteScreen) {
        setColor(whiteScreen.value);
        setColorName(whiteScreen.name);
        setCustomHex(whiteScreen.value);
      }
    }
  }, [identifier, location.pathname]);

  // ---------- Sync URL with color ----------
  useEffect(() => {
    if (location.pathname === "/" && colorName === "White Screen") return;
    const timer = setTimeout(() => {
      let targetUrl = "";
      const predefinedColor = ALL_COLORS.find((c) => tinycolor.equals(c.value, color));
      if (predefinedColor && predefinedColor.name === colorName) {
        targetUrl = `/${predefinedColor.slug}`;
      } else {
        const userInput = customHex.trim().replace("#", "");
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
    let width = 1920;
    let height = 1080;
    if (resolution === "480p") {
      width = 854;
      height = 480;
    } else if (resolution === "720p") {
      width = 1280;
      height = 720;
    } else if (resolution === "1080p") {
      width = 1920;
      height = 1080;
    } else if (resolution === "1440p") {
      width = 2560;
      height = 1440;
    } else if (resolution === "2160p") {
      width = 3840;
      height = 2160;
    } else if (resolution === "4320p") {
      width = 7680;
      height = 4320;
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

  const handleCustomColorChange = (newValue) => {
    setCustomHex(newValue);
    const colorObj = tinycolor(newValue);
    if (colorObj.isValid()) setColor(colorObj.toHexString());
    if (!newValue.startsWith("#")) setColorName(newValue);
    else setColorName("Custom Color");
  };

  return (
    <>
      <div className="home-container">
        {/* ---------- Container ---------- */}
        <div className="layout-container">
          {/* ---------- Main Preview ---------- */}
          <div className="preview-container">
            {!isFull && <h1 className="preview-title">{colorName}</h1>}
            <div
              id="preview"
              onClick={toggleFull}
              className={`preview-box ${isFull ? "full" : ""}`}
              style={{ backgroundColor: color }}
            >
              {!isFull && (
                <>
                  <div className="preview-actions">
                    <Link to="/" onClick={(e) => e.stopPropagation()} className="reset-btn">
                      Reset
                    </Link>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFull();
                    }}
                    className="fullscreen-btn"
                    style={{ color: tinycolor(color).isDark() ? 'white' : 'black' }}
                  >
                    ⛶
                  </button>
                  <div className={`esc-hint ${tinycolor(color).isDark() ? "light" : "dark"}`}>
                    Press ESC to exit fullscreen
                  </div>
                </>
              )}
            </div>

            {/* ---------- Bottom Colors ---------- */}
            {!isFull && (
              <div className="bottom-colors">
                {BOTTOM_COLORS.map((c) => (
                  <Link to={`/${c.slug}`} key={c.name} title={c.name}>
                    <div
                      className={`color-box ${color === c.value ? "active" : ""}`}
                      style={{ backgroundColor: c.value }}
                    >
                      <span
                        className="color-label"
                        style={{ color: c.value === '#000000' ? 'white' : 'black' }}
                      >
                        {c.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Left Sidebar ---------- */}
          {!isFull && (
            <div className="sidebar">
              {COLORS.map((c) => (
                <Link to={`/${c.slug}`} key={c.name} title={c.name}>
                  <div
                    className={`color-box ${color === c.value ? "active" : ""}`}
                    style={{ backgroundColor: c.value }}
                  >
                    <span className="color-label">{c.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ---------- Right Controls ---------- */}
          {!isFull && (
            <div className="controls">
              <label className="controls-label">Resolution</label>
              <select
                className="controls-select"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              >
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
                  <div className="custom-input">
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      placeholder="1920"
                    />
                    <span>px</span>
                  </div>
                  <div className="custom-input">
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      placeholder="1080"
                    />
                    <span>px</span>
                  </div>
                </>
              )}

              <button onClick={downloadImage} className="download-btn">
                Download
              </button>
              <div className="custom-color">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="Hex or Name..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <h2 className="footer-title">WhiteScreen Tool</h2>
            <p className="footer-subtitle">A simple color preview & download tool.</p>
          </div>
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/about" className="footer-link">About</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-right">
            <p className="footer-made">Made in India 🇮🇳</p>
            <p className="footer-copy">© {new Date().getFullYear()} WhiteScreen Tool</p>
          </div>
        </div>
      </footer>
    </>
  );
}
