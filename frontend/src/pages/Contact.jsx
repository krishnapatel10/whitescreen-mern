import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_i2o377p", // ✅ Service ID
        "template_6l3tp5s", // ✅ Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "bcqkOjtKVVourYvwe" // ✅ Public Key
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          setStatus("❌ Failed to send message. Try again.");
        }
      );
  };

  return (
    // 1. This new parent div organizes the page layout vertically
    <div className="flex flex-col min-h-screen">
      {/* 2. The main content area now grows to push the footer down */}
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
            ✉️ Contact Me
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition"
            >
              🚀 Send Message
            </button>
          </form>

          {status && (
            <p
              className={`mt-6 text-center font-medium ${
                status.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </main>

      {/* 3. The footer is now outside the main content, at the bottom of the page */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-white">WhiteScreen Tool</h2>
            <p className="text-sm text-gray-400">A simple color preview & download tool built with React + Tailwind CSS.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>Made in India 🇮🇳</p>
            <p>© {new Date().getFullYear()} WhiteScreen Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}