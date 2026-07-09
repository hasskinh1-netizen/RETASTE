import { Router } from "express";
import passport from "passport";
import { verifyToken } from "../middleware/authMiddleware";
import {
  login,
  register,
  registerAdmin,
  registerStaff,
  updateProfile,
  checkEmailAvailability,
  oauthSuccess,
  getCurrentUser,
} from "../controllers/authController";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const isGoogleEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
const isFacebookEnabled = !!process.env.FACEBOOK_APP_ID && !!process.env.FACEBOOK_APP_SECRET;

if (isGoogleEnabled) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${CLIENT_URL}/login`,
    }),
    oauthSuccess,
  );
} else {
  router.get("/google", (_req, res) => {
    res.status(503).json({ success: false, data: null, message: "Google OAuth chưa được cấu hình" });
  });
  router.get("/google/callback", (_req, res) => {
    res.status(503).json({ success: false, data: null, message: "Google OAuth chưa được cấu hình" });
  });
}

if (isFacebookEnabled) {
  router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] }),
  );
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: `${CLIENT_URL}/login`,
    }),
    oauthSuccess,
  );
} else {
  router.get("/facebook", (_req, res) => {
    res.status(503).json({ success: false, data: null, message: "Facebook OAuth chưa được cấu hình" });
  });
  router.get("/facebook/callback", (_req, res) => {
    res.status(503).json({ success: false, data: null, message: "Facebook OAuth chưa được cấu hình" });
  });
}

router.get("/me", verifyToken, getCurrentUser);

router.post("/register", register);
router.post("/register/admin", registerAdmin);
router.post("/register/staff", registerStaff);
router.post("/login", login);
router.put("/profile", verifyToken, updateProfile);
router.post("/check-email", checkEmailAvailability);

export default router;
