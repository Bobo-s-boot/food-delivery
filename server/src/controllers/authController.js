import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { USERS_DATA_PATH as DATA_PATH } from "../config/config.js";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.FIELD_REGISTER_EMPTY });
    }

    const data = await fs.readFile(DATA_PATH, "utf-8");
    const users = JSON.parse(data);

    if (users.find((user) => user.username === username)) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.USERER_ALREADY_EXISTS });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { id: Date.now(), username, password: hashedPassword };

    users.push(newUser);

    await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));

    res.status(201).json({
      user: { username },
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

    const data = await fs.readFile(DATA_PATH, "utf-8");
    const users = JSON.parse(data);

    const user = users.find((user) => user.username === username);

    if (!user) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.INVALID_CREDENTIALS });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.INVALID_CREDENTIALS });
    }

    res.status(200).json({ user: { username: user.username } });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.ERROR_IN_LOGIN });
  }
};
