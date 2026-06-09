import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getOrderStats,
  getAnalyticsData,
  getTopDishes,
  createSampleOrders,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // Allow guest checkout (no protect middleware)
router.get("/", protect, isAdmin, getAllOrders);
router.get("/stats", protect, isAdmin, getOrderStats);
router.get("/analytics", protect, isAdmin, getAnalyticsData);
router.get("/top-dishes", protect, isAdmin, getTopDishes);
router.post("/seed", protect, isAdmin, createSampleOrders);

export default router;
