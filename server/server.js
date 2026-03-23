import cors from "cors";
import express from "express";
import { logger } from "./src/middleware/logger.js";
import authRoutes from "./src/routes/authRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
