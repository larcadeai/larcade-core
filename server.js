import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ✅ ROUTE BASE (QUESTA RISOLVE IL PROBLEMA)
app.get("/", (req, res) => {
  res.json({ status: "🔥 Larcade API online" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Larcade API running on port", PORT);
});
