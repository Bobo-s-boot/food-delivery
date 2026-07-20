import Stripe from "stripe";
import Order from "../models/order.js";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(SERVER_ERORR_MESSAGE.STRIPE_SECRET_KEY_ERROR);
}

const stripe = new Stripe(stripeSecretKey);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", metadata = {} } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ error: SERVER_ERORR_MESSAGE.STRIPE_AMOUNT_ERROR });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.STRIPE_INTENT_ERROR, error);
    return res.status(500).json({ error: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      return res
        .status(400)
        .json({ error: SERVER_ERORR_MESSAGE.STRIPE_SIGNATURE_ERROR });
    }

    if (!webhookSecret) {
      return res
        .status(500)
        .json({ error: SERVER_ERORR_MESSAGE.STRIPE_MISSING_WEBHOOK_ERROR });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret,
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      await Order.updateMany(
        { stripePaymentIntentId: paymentIntent.id },
        {
          paymentStatus: "paid",
          paymentMethod: paymentIntent.payment_method_types?.includes("card")
            ? "Credit / Debit Card"
            : "Card",
        },
      );
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.STRIPE_WEBHOOK_ERROR, error);
    return res.status(400).json({ error: error.message });
  }
};
