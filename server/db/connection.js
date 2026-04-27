import mongoose from "mongoose";
import dns from "node:dns";
import { SERVER_ERORR_MESSAGE } from "../src/errors/erorr.js";

export const connectDB = async () => {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(SERVER_ERORR_MESSAGE.DB_URI_ERROR);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Успешно подключились к MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DB_CONNECTION_ERROR, error.message);
    throw error;
  }
};
