import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import {
  getAdminDashboard,
  getAdminOrders,
  getAdminRevenue,
  getAdminProducts,
  getAdminPayroll,
  getAdminSchedule,
} from "../controllers/adminController";

const router = Router();

router.use(verifyToken, authorizeRoles("admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/orders", getAdminOrders);
router.get("/revenue", getAdminRevenue);
router.get("/products", getAdminProducts);
router.get("/payroll", getAdminPayroll);
router.get("/schedule", getAdminSchedule);

export default router;
