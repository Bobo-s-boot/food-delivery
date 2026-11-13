import bcrypt from "bcryptjs";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import User from "../models/user.js";
import { generateToken } from "../config/auth.js";
import { nextSequenceValue, synchronizeSequence } from "../utils/sequences.js";
import { loginSchema, registerSchema } from "../validation/auth.js";

export const initializeUserIdSequence = async () => {
  const lastUser = await User.findOne().sort({ id: -1 }).select("id");
  await synchronizeSequence("user", lastUser?.id ?? 0);
};

export const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY,
        errors: validation.error.flatten(),
      });
    }
    const { username, password } = validation.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.USERER_ALREADY_EXISTS });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: await nextSequenceValue("user"),
      username,
      password: hashedPassword,
      role: "user",
      provider: "local",
      fullName: username,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      user: { username, role: newUser.role, token },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.USERER_ALREADY_EXISTS });
    }
    console.error(SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN, error);
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};

export const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY,
        errors: validation.error.flatten(),
      });
    }
    const { username, password } = validation.data;

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

    res
      .status(200)
      .json({ user: { username: user.username, role: user.role, token } });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN, error);
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};
