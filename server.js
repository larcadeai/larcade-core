import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.post("/status", async (req, res) => {
  const { email } = req.body;

  const { data } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("email", email)
    .single();

  res.json({ premium: data?.subscription_status === "active" });
});

app.post("/chat", async (req, res) => {
  const { email, message } = req.body;

  const { data } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("email", email)
    .single();

  if (!data || data.subscription_status !== "active") {
    return res.json({ reply: "😈 No. 9,99€. Poi riparliamo." });
  }

  res.json({ reply: `Paghi, quindi ascolto: ${message}` });
});

app.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await supabase.from("users").upsert({
        email: session.customer_details.email,
        stripe_customer_id: session.customer,
        subscription_status: "active"
      });
    }

    if (event.type === "customer.subscription.deleted") {
      await supabase
        .from("users")
        .update({ subscription_status: "inactive" })
        .eq("stripe_customer_id", event.data.object.customer);
    }

    res.json({ received: true });
  }
);

app.listen(3000, () => {
  console.log("🔥 larcade-core attivo");
});
