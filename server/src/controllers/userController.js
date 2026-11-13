import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import User from "../models/user.js";
import { userIdSchema } from "../validation/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ id: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.USERS_NOT_FOUND, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.USERS_NOT_FOUND });
  }
};

export const getUserById = async (req, res) => {
  try {
    const validation = userIdSchema.safeParse(req.params.id);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND,
        errors: validation.error.flatten(),
      });
    }

    const user = await User.findOne({ id: validation.data }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.USER_NOT_FOUND, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const validation = userIdSchema.safeParse(req.user?.id);
    if (!validation.success) {
      return res.status(401).json({
        message: SERVER_ERORR_MESSAGE.AUTH_TOKEN_FAILED_ERROR,
      });
    }

    const user = await User.findOne({ id: validation.data }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.PROFILE_NOT_FOUND, error);
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.PROFILE_NOT_FOUND });
  }
};
