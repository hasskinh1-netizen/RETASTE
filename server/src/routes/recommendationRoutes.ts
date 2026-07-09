import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { getRecommendations, recordView } from "../controllers/recommendationController";

const router = Router();

router.get("/", verifyToken, getRecommendations);
router.post("/record-view", verifyToken, recordView);

export default router;
