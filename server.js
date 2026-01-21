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
app.get("/"app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Larcade Premium",
              description: "Accesso completo a Larcade"
            },
            unit_amount: 999,
            recurring: { interval: "month" }
          },
          quantity: 1
        }
      ],
      success_url: "https://larcade.ai/success",
      cancel_url: "https://larcade.ai/cancel"
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});, (req, res) => {
  res.json({ status: "🔥 Larcade API online" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Larcade API running on port", PORT);
});
