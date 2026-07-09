import { Router } from "express";
import { listPromotions, validatePromoCode } from "../controllers/promotionController";

const router = Router();

router.get("/", listPromotions);
router.post("/validate", validatePromoCode);

export default router;
