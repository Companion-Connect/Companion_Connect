// src/logToLogflare.ts

const SOURCE_ID = "8dd16952-887c-412b-a442-1dcea749a39a";     // your Logflare Source ID
const API_KEY   = "ZViE1rDVGVvN";         // your *ingest* token
const URL       = `https://api.logflare.app/api/logs?source=${SOURCE_ID}&api_key=${API_KEY}`;

export function logToServer(
  level: "info" | "warn" | "error",
  message: string,
  metadata?: any
) {
  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level, message, metadata }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error("Logflare error:", res.status, res.statusText);
      }
    })
    .catch((err) => {
      console.error("Network error sending log:", err);
    });
}

