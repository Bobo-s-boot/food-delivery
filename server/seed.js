import "dotenv/config";
import mongoose from "mongoose";
import Restaurant from "./src/models/Restaurant.js";
import User from "./src/models/user.js";
import restoraurants from "./data/restaurants.json" with { type: "json" };
import users from "./data/users.json" with { type: "json" };

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to data base");

    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await console.log("Cleaning");

    await Restaurant.insertMany(restoraurants);
    await User.insertMany(users);
    console.log(`Add: ${restoraurants.length}`);
    console.log(`Add ${users.length}`);

    mongoose.connection.close();
    console.log("Finish");
    process.exit(0);
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};

seedDB();
