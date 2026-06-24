import express from "express";
import {
  getUserById,
  getAllUsers,
  getUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getUserProfile);
router.get("/", isAdmin, getAllUsers);
router.get("/:id", isAdmin, getUserById);

export default router;
