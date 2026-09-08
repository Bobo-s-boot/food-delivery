import express from "express";
import {
  createPaymentIntent,
  handleStripeWebhook,
} from "../controllers/stripeController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/webhook", handleStripeWebhook);

export default router;
