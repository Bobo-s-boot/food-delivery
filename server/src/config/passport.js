import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import AppleStrategy from "passport-apple";
import TwitterStrategy from "@superfaceai/passport-twitter-oauth2";
import User from "../models/User.js";

// Helper function to find or create user
const findOrCreateUser = async (provider, profile, done) => {
  try {
    let user = await User.findOne({ provider, providerId: profile.id });

    if (!user) {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (email) {
        user = await User.findOne({ username: email });
      }

      if (!user) {
        const username = email || `${provider}_user_${profile.id}`;
        user = await User.create({
          id: Date.now(),
          username,
          provider,
          providerId: profile.id,
          fullName: profile.displayName || profile.username || username,
          role: "user",
          password: null,
        });
      } else {
        user.provider = provider;
        user.providerId = profile.id;
        await user.save();
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
