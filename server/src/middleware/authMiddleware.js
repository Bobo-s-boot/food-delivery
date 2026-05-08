import jwt from "jsonwebtoken";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.SESSION_SECRET || "super_secret_jwt_key",
      );

      req.user = decoded;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: SERVER_ERORR_MESSAGE.AUTH_TOKEN_FAILED_ERROR });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: SERVER_ERORR_MESSAGE.AUTH_TOKEN_EMPTY_ERROR });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(403).json({
      message: SERVER_ERORR_MESSAGE.ADMIN_ACCESS_REQUIRED,
    });
  }
};
