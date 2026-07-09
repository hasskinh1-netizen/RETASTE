import { Router } from "express";
import { getAllFoods, getFoodById } from "../controllers/foodController";

const router = Router();

router.get("/", getAllFoods);
router.get("/:id", getFoodById);

export default router;
