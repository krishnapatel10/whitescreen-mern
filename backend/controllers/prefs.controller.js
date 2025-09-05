import Preference from "../model/Preference.js";

export async function getPreference(req, res) {
  try {
    const { deviceId } = req.params;
    const pref = await Preference.findOne({ deviceId });
    if (!pref) return res.status(404).json({ message: "not found" });
    return res.json(pref);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function upsertPreference(req, res) {
  try {
    const { deviceId } = req.params;
    const { color } = req.body;
    const pref = await Preference.findOneAndUpdate(
      { deviceId },
      { $set: { color: color || "#ffffff" } },
      { new: true, upsert: true }
    );
    return res.json(pref);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
