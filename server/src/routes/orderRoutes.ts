import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import {
  listOrders,
  createOrder,
  getOrder,
  createShippingOrder,
} from "../controllers/orderController";

const router = Router();

router.get("/", verifyToken, listOrders);
router.post("/", verifyToken, createOrder);
router.get("/:id", getOrder);
router.post(
  "/shipping",
  verifyToken,
  authorizeRoles("admin", "staff"),
  createShippingOrder,
);

export default router;
