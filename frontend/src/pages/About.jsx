import React from 'react'

export default function About() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">About This Tool</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        This is a simple React + Tailwind CSS project that provides two main features:  
        <br />1. A WhiteScreen tool for solid color screens.  
        <br />2. A Prank tool for fun fake screens.  
        <br />Inspired by <a href="https://www.whitescreen.online/" className="text-blue-500 underline">whitescreen.online</a>.
      </p>
    </div>
  )
}
