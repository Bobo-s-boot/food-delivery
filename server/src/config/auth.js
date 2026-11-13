import jwt from "jsonwebtoken";

export const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }

  return secret;
};

export const generateToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    getSessionSecret(),
    { expiresIn: "30d" },
  );
