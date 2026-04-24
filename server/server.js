import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { logger } from "./src/middleware/logger.js";
import authRoutes from "./src/routes/authRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import { connectDB } from "./db/connection.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту http://localhost:${PORT}`);
  });
});
