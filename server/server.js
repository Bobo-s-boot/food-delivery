import "dotenv/config";
import cors from "cors";
import express from "express";
import { logger } from "./src/middleware/logger.js";
import authRoutes from "./src/routes/authRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import { connectDB } from "./db/connection.js";
import { initializeRestaurantsFromFile } from "./src/controllers/restaurantController.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await initializeRestaurantsFromFile();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Не удалось запустить сервер:", error.message);
    process.exit(1);
  }
};

startServer();
