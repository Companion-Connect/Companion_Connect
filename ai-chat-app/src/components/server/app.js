// server/app.js
import express from "express";
import cors from "cors";
import { logger } from "./logger.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => {
  console.log("💡 /api/health hit");
  res.json({ ok: true });
});

app.post("/api/log", (req, res) => {
  try {
    console.log("💡 /api/log hit with:", req.body);
    const { level, message, metadata } = req.body;
    logger.log({ level, message, metadata });
    return res.sendStatus(204);
  } catch (err) {
    console.error("🔥 error in /api/log handler:", err);
    return res.status(500).send("Logging failed");
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server up on port 3000");
});
