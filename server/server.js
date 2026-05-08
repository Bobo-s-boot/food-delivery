import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "./src/config/passport.js";
import { logger } from "./src/middleware/logger.js";
import authRoutes from "./src/routes/authRoutes.js";
import dishRoutes from "./src/routes/dishRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { connectDB } from "./db/connection.js";
import { initializeRestaurantsFromFile } from "./src/controllers/restaurantController.js";
import { SERVER_ERORR_MESSAGE } from "./src/errors/erorr.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(logger);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dishes", dishRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await initializeRestaurantsFromFile();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error.message || SERVER_ERORR_MESSAGE.DB_CONNECTION_ERROR);
    process.exit(1);
  }
};

startServer();
