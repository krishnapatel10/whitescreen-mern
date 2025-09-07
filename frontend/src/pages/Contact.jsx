import React, { useState } from "react";
import emailjs from "@emailjs/browser";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
          ✉️ Contact Me
        </h2>
        {/* <p className="text-center text-gray-500 mb-8">
          Have a question or want to work together? Drop me a message!
        </p> */}

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
            //   placeholder="e.g. Alex Johnson"
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
            //   placeholder="e.g. alex.johnson@example.com"
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
            //   placeholder="Write something like 'Hi, I’d love to collaborate on a project...'"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition"
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
    </div>
  );
}
