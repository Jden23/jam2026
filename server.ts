import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", game: "Buddy Up" });
  });

  // Server-side Gemini API endpoint for Drug Prevention & Peer Pressure Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          reply: "I'm here to talk through any peer pressure or questions about vapes and staying drug-free. Saying 'no' can feel tough in the moment, but standing your ground and staying healthy is something you can always be proud of.",
          fallback: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are a supportive, non-judgmental conversational guide in the web game "Buddy Up" for Singapore teens (ages 13–18).
The core focus is drug prevention, vaping awareness, handling peer pressure, and dispelling common myths.
Key rules:
1. DO NOT invent or quote specific numerical statistics, percentages, or phone numbers.
2. Maintain a friendly, non-preachy, supportive tone that speaks to teenagers as equals.
3. Help teens practice refusal skills (how to say "no thanks, not my thing", how to walk away without feeling uncool).
4. Address common myths (e.g., that vapes are "harmless flavoured water vapour", or that "everyone is doing it") with simple, clear logic: vapes contain harmful chemicals and addictive nicotine designed to get users hooked.
5. Emphasize that real friends always respect your choices and boundaries.
6. Keep replies concise (2 to 4 sentences) so they read naturally in an in-game dialogue box.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const turn of history.slice(-6)) {
          contents.push({
            role: turn.sender === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message || "Hello" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Standing your ground when facing peer pressure takes real courage. Real friends will always respect your decision.";
      res.json({ reply: replyText, fallback: false });
    } catch (err: any) {
      console.warn("Gemini API call returned error, falling back:", err?.message || err);
      res.status(200).json({
        reply: "Standing your ground when facing peer pressure takes real courage. Real friends will always respect your decision.",
        fallback: true,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Buddy Up server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
