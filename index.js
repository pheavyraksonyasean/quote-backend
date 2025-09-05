import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow frontend + local
app.use(cors({
  origin: [
    "https://quote-generator-omega-tawny.vercel.app", // ✅ fixed
    "http://localhost:3000"
  ],
  methods: ["GET"],
}));

// Health check
app.get("/", (_req, res) => res.send("Backend is running"));
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Random quote endpoint
app.get("/api/random-quote", async (_req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_random_quote");
    if (error) throw error;

    const quote = data?.[0];
    if (quote) return res.json(quote);

    res.status(404).json({ error: "No quotes found." });
  } catch (err) {
    console.error("Error fetching random quote:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
