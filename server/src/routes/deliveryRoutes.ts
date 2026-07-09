import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import { getQuote, createDelivery } from "../controllers/deliveryController";

const router = Router();

router.post("/quote", verifyToken, authorizeRoles("admin", "staff"), getQuote);
router.post(
  "/order",
  verifyToken,
  authorizeRoles("admin", "staff"),
  createDelivery,
);

export default router;
