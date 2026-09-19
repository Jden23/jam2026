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

  // Server-side Gemini API endpoint for AI Study Buddy
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          reply: null,
          fallback: true,
          notice: "Using local knowledge base",
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

      const systemInstruction = `You are "Buddy AI", a warm, empathetic, and encouraging peer study mentor in the game "Buddy Up" for Singapore secondary school and junior college teens (ages 13–18).
Key guidelines:
1. Speak in a friendly, conversational, and uplifting tone accessible to Singapore students (e.g. relatable references to exam revision, taking breaks, staying hydrated, getting enough sleep).
2. Never shame or criticize the student for feeling anxious, tired, or struggling to focus. Validate their feelings.
3. Keep responses concise (2 to 4 sentences maximum) so it feels like a snappy in-game dialogue rather than a textbook lecture.
4. Ground your advice in real study science: active recall, spaced repetition, the 20-20-20 rule, and getting 7-9 hours of sleep to consolidate memories.
5. If the user mentions extreme distress, self-harm, or feeling hopeless, gently remind them that they are worthy and not alone, and mention real Singapore support lines: Samaritans of Singapore (SOS) 1767 / WhatsApp 9151 1767, YouthLine 1771, or CHAT at 6493 6500.`;

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
        parts: [{ text: message || "Hi buddy!" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm right here with you, Rin. Take a deep breath—you've got this!";
      res.json({ reply: replyText, fallback: false });
    } catch (err: any) {
      console.warn("Gemini API call returned error, falling back:", err?.message || err);
      res.status(200).json({
        reply: null,
        fallback: true,
        error: err?.message,
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
