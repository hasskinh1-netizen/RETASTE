import { Request, Response } from "express";
import { getRecommendationsForUser, recordViewedDish } from "../services/recommendationService";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { id: number } }).user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Unauthorized" });
    }

    const recommendations = await getRecommendationsForUser(Number(user.id));
    return res
      .status(200)
      .json({
        success: true,
        data: recommendations,
        message: "Recommendations loaded",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        data: null,
        message: "Could not load recommendations",
      });
  }
};

export const recordView = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { id: number } }).user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Unauthorized" });
    }

    const { foodId } = req.body;
    if (!foodId || isNaN(Number(foodId))) {
      return res
        .status(400)
        .json({ success: false, data: null, message: "Invalid food ID" });
    }

    await recordViewedDish(Number(user.id), Number(foodId));
    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "View recorded",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        data: null,
        message: "Could not record view",
      });
  }
};
