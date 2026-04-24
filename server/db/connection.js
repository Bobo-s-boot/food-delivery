import mongoose from "mongoose";
import dns from "node:dns";

export const connectDB = async () => {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Успешно подключились к MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error.message);
    throw error;
  }
};
