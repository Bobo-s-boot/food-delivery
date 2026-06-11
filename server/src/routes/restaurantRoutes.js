import express from "express";

import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

router.post("/", protect, isAdmin, createRestaurant);
router.delete("/:id", protect, isAdmin, deleteRestaurant);

export default router;
