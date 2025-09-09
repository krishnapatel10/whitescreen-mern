import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "./PrankScreen.css";

import VirusAlert from '../assets/virusalert.png';
import FakeBlue from "../assets/blueScreen_fullHD.gif";
import brokenscreen from "../assets/broken-screen.webp";
import FakeUpdate from "../assets/Fake Update Screen GIF.gif";
import NoiseScreen from "../assets/noise.gif";
import MatrixScreen from "../assets/matrix.gif";
import NoiseSound from "../assets/noisesound.mp3";
import FakeError from "../assets/fakeError.png"
import HackerScreen from "../assets/hacker-typer.gif"

// Prank data with URL slugs
const SIDEBAR_PRANKS = [
  { name: "Broken Screen", type: "broken", img: brokenscreen, slug: "broken-screen" },
  { name: "Hacker Screen", type: "hacker", img: HackerScreen, slug: "hacker-screen" },
  { name: "Noise Screen", type: "gps", img: NoiseScreen, slug: "noise-screen" },
];

const BOTTOM_PRANKS = [
  { name: "Fake Error", type: "error", img: FakeError, slug: "fake-error" },
  { name: "Fake Blue", type: "bsod", img: FakeBlue, slug: "Fake-Blue" },
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
      <div className="prank-main">

        {/* Sidebar */}
        {!isFull && (
          <div className="prank-sidebar">
            {SIDEBAR_PRANKS.map((p) => (
              <Link to={`/${p.slug}`} key={p.type}>
                <div className="prank-box">
                  <img src={p.img} alt={p.name} className="prank-box-img" />
                  <span className="prank-box-name">{p.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Main Preview */}
        <div className="prank-preview">
          {!isFull && <h1 className="prank-title">{prankName}</h1>}

          <div
            id="preview-prank"
            onClick={toggleFull}
            className={`preview-box ${isFull ? "preview-full" : ""}`}
            style={{
              backgroundImage: `url(${activePrank ? ALL_PRANKS.find((p) => p.type === activePrank)?.img : FakeBlue})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 0 40px #fcd08d"
            }}
          >
            {!isFull && (
              <div className="prank-reset-container">
                <Link
                  to="/Prank-Screen"
                  onClick={(e) => e.stopPropagation()}
                  className="prank-reset-btn"
                >
                  Reset
                </Link>
              </div>
            )}

            {!isFull && (
              <button onClick={(e) => { e.stopPropagation(); toggleFull(); }} className="fullscreen-btn">
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
              <div className="esc-hint">
                Press ESC to exit fullscreen
              </div>
            )}
          </div>

          {/* Bottom Pranks */}
          {!isFull && (
            <div className="prank-bottom">
              {BOTTOM_PRANKS.map((p) => (
                <Link to={`/${p.slug}`} key={p.type}>
                  <div className="prank-box">
                    <img src={p.img} alt={p.name} className="prank-box-img" />
                    <span className="prank-box-name">{p.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          {/* Left Section */}
          <div className="footer-left">
            <h2 className="footer-title">WhiteScreen Tool</h2>
            <p className="footer-subtitle">A simple color preview & download tool.</p>
          </div>

          {/* Middle Links */}
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>

          {/* Right Section */}
          <div className="footer-right">
            <p className="footer-made">Made in India 🇮🇳</p>
            <p className="footer-copy">© {new Date().getFullYear()} WhiteScreen Tool</p>
          </div>
        </div>
      </footer>
    </>
  );
}
