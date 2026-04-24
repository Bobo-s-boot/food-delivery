import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getAllRestaurants,
  getRestaurantById,
} from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", protect, getAllRestaurants);
router.get("/:id", protect, getRestaurantById);

export default router;
