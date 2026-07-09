import { Request, Response } from "express";
import mysqlPool from "../database/mysql";

export const getAllFoods = async (_req: Request, res: Response) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT id, product_name as name, description, base_price as price, image_url FROM products WHERE is_available = TRUE LIMIT 24",
    );
    return res.json({ success: true, data: rows, message: "Foods loaded" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, data: null, message: "Could not load foods" });
  }
};

export const getFoodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await mysqlPool.query(
      "SELECT id, product_name as name, description, base_price as price, image_url FROM products WHERE id = ? AND is_available = TRUE LIMIT 1",
      [id],
    );
    const food = Array.isArray(rows) && rows.length ? rows[0] : null;

    if (!food) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Food not found" });
    }

    return res.json({ success: true, data: food, message: "Food loaded" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, data: null, message: "Could not load food" });
  }
};
