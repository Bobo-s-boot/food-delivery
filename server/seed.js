import "dotenv/config";
import mongoose from "mongoose";
import Restaurant from "./src/models/Restaurant.js";
import restoraurants from "./data/restaurants.json" with { type: "json" };

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to data base");

    await Restaurant.deleteMany({});
    console.log("Cleaning");

    await Restaurant.insertMany(restoraurants);
    console.log(` Add: ${restoraurants.length}`);

    mongoose.connection.close();
    console.log("Finish");
    process.exit(0);
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};

seedDB();
