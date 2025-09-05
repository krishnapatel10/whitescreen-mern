import React from "react";

export default function Controls({ color, setColor, setWhite, setBlack, toggleFull }) {
  return (
    <div className="controls">
      <button onClick={setWhite}>White</button>
      <button onClick={setBlack}>Black</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Pick color"
      />
      <button onClick={toggleFull}>Fullscreen</button>
    </div>
  );
}
