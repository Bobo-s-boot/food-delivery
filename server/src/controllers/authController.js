import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.SESSION_SECRET || "super_secret_jwt_key",
    { expiresIn: "30d" },
  );
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.USERER_ALREADY_EXISTS });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: Date.now(),
      username,
      password: hashedPassword,
      role: "user",
      provider: "local",
      fullName: username,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      user: { username, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.INVALID_CREDENTIALS });
    }

    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.INVALID_CREDENTIALS });
    }

    const token = generateToken(user);

    res.status(200).json({ user: { username: user.username, token } });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};
