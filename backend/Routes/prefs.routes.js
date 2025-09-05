import { Router } from "express";
import { getPreference, upsertPreference } from "../controllers/prefs.controller.js";

const router = Router();

// GET /api/prefs/:deviceId
router.get("/:deviceId", getPreference);

// POST /api/prefs/:deviceId { color: "#ffffff" }
router.post("/:deviceId", upsertPreference);

export default router;
