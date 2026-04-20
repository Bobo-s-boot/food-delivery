import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "./src/config/passport.js";
import { logger } from "./src/middleware/logger.js";
import authRoutes from "./src/routes/authRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Need credentials for session cookies and OAuth callbacks to work cleanly, but simple cors is OK if redirecting.
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());
app.use(logger);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
