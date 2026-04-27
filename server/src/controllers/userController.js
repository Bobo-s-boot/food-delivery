import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ id: 1 });

    res.status(200).json(users);
  } catch (erorr) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.USERS_NOT_FOUND });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: parseInt(req.params.id) });

    if (!user) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
  }
};
