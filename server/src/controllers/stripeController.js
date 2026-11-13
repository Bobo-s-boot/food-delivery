import Stripe from "stripe";
import Order from "../models/order.js";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import {
  paymentIntentSchema,
  stripeWebhookSchema,
} from "../validation/stripe.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(SERVER_ERORR_MESSAGE.STRIPE_SECRET_KEY_ERROR);
}

export const stripe = new Stripe(stripeSecretKey);

export const createPaymentIntent = async (req, res) => {
  try {
    const validation = paymentIntentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: SERVER_ERORR_MESSAGE.STRIPE_AMOUNT_ERROR,
        details: validation.error.flatten(),
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validation.data.amount,
      currency: validation.data.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: validation.data.metadata,
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.STRIPE_INTENT_ERROR, error);
    return res.status(500).json({
      error: SERVER_ERORR_MESSAGE.STRIPE_INTENT_ERROR,
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  try {
    const validation = stripeWebhookSchema.safeParse({
      signature: req.headers["stripe-signature"],
      body: req.body,
    });
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: SERVER_ERORR_MESSAGE.STRIPE_SIGNATURE_ERROR });
    }

    const { signature, body } = validation.data;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res
        .status(500)
        .json({ error: SERVER_ERORR_MESSAGE.STRIPE_MISSING_WEBHOOK_ERROR });
    }

    const event = stripe.webhooks.constructEvent(
      body,
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
    return res
      .status(400)
      .json({ error: SERVER_ERORR_MESSAGE.STRIPE_WEBHOOK_ERROR });
  }
};
