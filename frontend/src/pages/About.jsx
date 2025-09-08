import React from "react";
import { Link } from "react-router-dom"; // 👈 Link import kiya

export default function About() {
  const useCases = [
    { title: "White Screen to Copy Drawings", desc: "Place a paper on your screen to trace or redraw an image with ease." },
    { title: "White Screen as a Light Source", desc: "Use it as a backlight for product photography or a lightbox effect." },
    { title: "White Screen to Check Monitor", desc: "Quickly detect dead/stuck pixels and test display quality." },
    { title: "White Screen to Blank Screen", desc: "Need a break? Use a plain white screen to reduce distractions." },
    { title: "White Screen as a Light to Read", desc: "Turn your screen into a reading light when it’s dark." },
    { title: "White Screen as a Light to Makeup", desc: "Perfect bright background for makeup or selfies." },
    { title: "White Screen to Clean Monitor", desc: "Spot dust, smudges, and dirt easily while cleaning your display." },
    { title: "White Screen to Look for Dust", desc: "Find dust particles or use it as webcam lighting." },
    { title: "White Screen to Catch Flies", desc: "Attract small flies with a bright white screen 😅." },
    { title: "White Screen to Make a Flipbook", desc: "Use as a tracing light for hand-drawn animations or sketches." },
    { title: "White Screen to Focus Yourself", desc: "Stay distraction-free during study sessions by using a blank screen." },
    { title: "White Screen to Configure Monitor Settings", desc: "Helps while adjusting brightness, contrast, or screen alignment." },
    { title: "White Screen to Draw at Night", desc: "Use it as a backlight when sketching or tracing at night." },
    { title: "White Screen for Lighting", desc: "Turn your screen into a temporary light source for video calls or photography." },
    { title: "White Screen for Visual Purity", desc: "Enjoy a pure, clean and soothing environment for relaxation or meditation." },
    { title: "White Screen for Design Work", desc: "Use it as a blank canvas for design, sketching, and creative tasks." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="flex-grow py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            About 
          </h1>
          <p className="text-lg text-center text-gray-600 mb-12">
            Our White Screen Tool is a simple yet powerful utility that turns your device into 
            a pure white display. Whether you need it for productivity, creativity, or fun – 
            here are some of the most popular ways people use it:
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {useCases.map((item, index) => (
              <div
                key={index}
                className=" cursor-pointer p-6 bg-white rounded-xl transition transform hover:scale-105 border border-gray-200"
                style={{
                  boxShadow: " 0 0 5px #fcd08d", // ✨ yellow glow + soft shadow
                }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
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

    </div>
  );
}
