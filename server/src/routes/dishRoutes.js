import express from "express";
import {
  getDishes,
  getDishById,
  createDish,
  deleteDish,
} from "../controllers/dishController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDishes);
router.get("/:id", getDishById);

router.post("/", protect, isAdmin, createDish);
router.delete("/:id", protect, isAdmin, deleteDish);

export default router;
