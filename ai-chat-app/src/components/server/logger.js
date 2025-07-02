// server/logger.js
import winston from "winston";
import LogflareTransport from "winston-logflare";
import path from "path";
import fs from "fs";

// ensure logs/ exists
const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "chat-backend" },
  transports: [
    // 1) local console
    new winston.transports.Console(),

    // 2) file fallback
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      maxsize: 5e6,
      maxFiles: 5,
    }),

    // 3) push to Logflare
    new LogflareTransport({
      apiKey: "ZViE1rDVGVvN",
      sourceToken: "8dd16952-887c-412b-a442-1dcea749a39a",
      // optional tuning:
      batchMaxSize: 20,         // max logs to batch per request
      batchFlushInterval: 2000, // max ms before sending a non-full batch
    }),
  ],
});

export { logger };
