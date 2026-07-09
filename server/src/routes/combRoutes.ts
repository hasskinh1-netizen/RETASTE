import { Router } from "express";
import { listCombos, getCombo } from "../controllers/combController";

const router = Router();

router.get("/", listCombos);
router.get("/:id", getCombo);

export default router;
