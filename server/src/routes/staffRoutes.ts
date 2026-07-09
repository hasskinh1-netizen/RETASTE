import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import {
  getStaffDashboard,
  getStaffOrders,
  getStaffSchedule,
  getStaffFeedback,
} from "../controllers/staffController";

const router = Router();

router.use(verifyToken, authorizeRoles("staff"));
router.get("/dashboard", getStaffDashboard);
router.get("/orders", getStaffOrders);
router.get("/schedule", getStaffSchedule);
router.get("/feedback", getStaffFeedback);

export default router;
