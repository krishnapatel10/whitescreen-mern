import mongoose from "mongoose";

const PreferenceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    color: { type: String, default: "#ffffff" }
  },
  { timestamps: true }
);

export default mongoose.model("Preference", PreferenceSchema);
