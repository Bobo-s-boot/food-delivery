import express from "express";
import { getUserById, getAllUsers } from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
