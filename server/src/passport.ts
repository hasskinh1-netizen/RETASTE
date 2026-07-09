import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "./repositories/userRepository";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:5000/api/v1/auth/google/callback";
const FACEBOOK_CALLBACK_URL =
  process.env.FACEBOOK_CALLBACK_URL ||
  "http://localhost:5000/api/v1/auth/facebook/callback";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const findOrCreateOAuthUser = async (
  email: string,
  name: string,
  providerId: string,
) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash(providerId, 10);
  return await createUser(name, normalizedEmail, hashedPassword, "customer");
};

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName || "Khách hàng";
          const providerId = profile.id;

          if (!email || !providerId) {
            return done(new Error("Google OAuth did not return an email or id"), undefined);
          }

          const user = await findOrCreateOAuthUser(email, name, providerId);
          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      },
    ),
  );
} else {
  console.warn("Google OAuth is not configured. Skipping Google strategy.");
}

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || "Khách hàng";
          const providerId = profile.id;

          if (!email || !providerId) {
            return done(new Error("Facebook OAuth did not return an email or id"), undefined);
          }

          const user = await findOrCreateOAuthUser(email, name, providerId);
          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      },
    ),
  );
} else {
  console.warn("Facebook OAuth is not configured. Skipping Facebook strategy.");
}

export default passport;
