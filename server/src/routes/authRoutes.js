import express from "express";
import passport from "passport";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SESSION_SECRET || "super_secret_jwt_key",
    { expiresIn: "30d" }
  );
};

const oauthCallback = (req, res) => {
  if (req.user) {
    const token = generateToken(req.user);
    const userStr = encodeURIComponent(JSON.stringify({ username: req.user.username, fullName: req.user.fullName, token }));
    res.redirect(`http://127.0.0.1:5173/auth?user=${userStr}`);
  } else {
    res.redirect(`http://127.0.0.1:5173/auth?error=${encodeURIComponent("Authentication failed")}`);
  }
};

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://127.0.0.1:5173/auth?error=Failed" }), oauthCallback);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "http://127.0.0.1:5173/auth?error=Failed" }), oauthCallback);

router.get("/apple", passport.authenticate("apple"));
router.get("/apple/callback", passport.authenticate("apple", { failureRedirect: "http://127.0.0.1:5173/auth?error=Failed" }), oauthCallback);
router.post("/apple/callback", express.urlencoded({ extended: true }), passport.authenticate("apple", { failureRedirect: "http://127.0.0.1:5173/auth?error=Failed" }), oauthCallback);

router.get("/x", passport.authenticate("twitter", { scope: ["tweet.read", "users.read"] }));
router.get("/x/callback", passport.authenticate("twitter", { failureRedirect: "http://127.0.0.1:5173/auth?error=Failed" }), oauthCallback);

export default router;
