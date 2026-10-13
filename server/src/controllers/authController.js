import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";
import User from "../models/user.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
};

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
      user: { username, role: newUser.role, token },
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

    res
      .status(200)
      .json({ user: { username: user.username, role: user.role, token } });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { username, lang } = req.body;

    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY });
    }

    const cleanUsername = username.trim();
    const user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let recipientEmail = null;
    if (user.email && emailRegex.test(user.email.trim())) {
      recipientEmail = user.email.trim();
    } else if (emailRegex.test(user.username.trim())) {
      recipientEmail = user.username.trim();
    }

    if (!recipientEmail) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.USER_NO_EMAIL,
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    try {
      await sendPasswordResetEmail({
        to: recipientEmail,
        resetCode,
        username: user.fullName || user.username,
        lang: lang || "uk",
      });
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError.message);
      if (emailError.code === "SMTP_NOT_CONFIGURED") {
        return res
          .status(500)
          .json({ message: SERVER_ERORR_MESSAGE.EMAIL_NOT_CONFIGURED });
      }
      return res
        .status(500)
        .json({ message: SERVER_ERORR_MESSAGE.EMAIL_SEND_FAILED });
    }

    res.status(200).json({
      success: true,
      message: SERVER_ERORR_MESSAGE.RESET_CODE_SENT,
      maskedEmail: maskEmail(recipientEmail),
      username: user.username,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { username, resetCode, newPassword } = req.body;

    if (!username || !resetCode || !newPassword) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY });
    }

    if (newPassword.length < 4) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.PASSWORD_TOO_SHORT });
    }

    const cleanUsername = username.trim();
    const cleanCode = resetCode.toString().trim();

    const user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.USER_NOT_FOUND });
    }

    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken.trim() !== cleanCode
    ) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.RESET_CODE_INVALID });
    }

    if (
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.RESET_CODE_EXPIRED });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: SERVER_ERORR_MESSAGE.PASSWORD_RESET_SUCCESS,
      user: {
        username: user.username,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};
