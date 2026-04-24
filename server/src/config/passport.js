import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import AppleStrategy from "passport-apple";
import TwitterStrategy from "@superfaceai/passport-twitter-oauth2";
import fs from "fs/promises";
import { USERS_DATA_PATH } from "./config.js";

// Helper function to find or create user
const findOrCreateUser = async (provider, profile, done) => {
  try {
    const data = await fs.readFile(USERS_DATA_PATH, "utf-8");
    const users = JSON.parse(data);

    // Look for user by provider ID
    let user = users.find((u) => u.provider === provider && u.providerId === profile.id);

    if (!user) {
      // Look for user by email if available to link accounts, or just create new
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (email) {
        user = users.find((u) => u.username === email);
      }

      if (!user) {
        const username = email || `${provider}_user_${profile.id}`;
        user = {
          id: Date.now(),
          username: username,
          provider: provider,
          providerId: profile.id,
          fullName: profile.displayName || profile.username || username
        };
        users.push(user);
        await fs.writeFile(USERS_DATA_PATH, JSON.stringify(users, null, 2));
      } else {
        // Link provider info to existing user
        user.provider = provider;
        user.providerId = profile.id;
        await fs.writeFile(USERS_DATA_PATH, JSON.stringify(users, null, 2));
      }
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser("google", profile, done);
    }
  )
);

// Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "mock-app-id",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "mock-app-secret",
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser("facebook", profile, done);
    }
  )
);

// Apple
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID || "mock-client-id",
      teamID: process.env.APPLE_TEAM_ID || "mock-team-id",
      keyID: process.env.APPLE_KEY_ID || "mock-key-id",
      privateKeyString: process.env.APPLE_PRIVATE_KEY || "mock-private-key",
      callbackURL: "/api/auth/apple/callback",
    },
    (accessToken, refreshToken, idToken, profile, done) => {
      // Apple profile might be empty on subsequent logins, use idToken decoded info if needed
      // Mocking profile to fit generic findOrCreateUser structure
      const mockProfile = { id: idToken ? "apple-id-mock" : "apple-id", displayName: "Apple User" };
      findOrCreateUser("apple", mockProfile, done);
    }
  )
);

// X (Twitter OAuth 2.0)
passport.use(
  new TwitterStrategy(
    {
      clientType: "confidential",
      clientID: process.env.TWITTER_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "mock-client-secret",
      callbackURL: "/api/auth/x/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser("x", profile, done);
    }
  )
);

export default passport;
