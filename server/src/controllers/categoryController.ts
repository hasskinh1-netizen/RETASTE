import { Request, Response } from "express";
import mysqlPool from "../database/mysql";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const [categories] = await mysqlPool.execute(
      "SELECT id, category_name, category_slug, image_url, is_active FROM categories WHERE is_active = TRUE ORDER BY display_order",
    );
    res.json({
      success: true,
      data: categories,
      message: "Categories fetched",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, data: null, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { category_name, category_slug, image_url, display_order } = req.body;

    if (!category_name || !category_slug) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: "Missing required fields",
        });
    }

    const [result] = await mysqlPool.execute(
      "INSERT INTO categories (category_name, category_slug, image_url, display_order) VALUES (?, ?, ?, ?)",
      [category_name, category_slug, image_url || null, display_order || 0],
    );

    res.json({
      success: true,
      data: { id: (result as any).insertId },
      message: "Category created",
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      category_name,
      category_slug,
      image_url,
      display_order,
      is_active,
    } = req.body;

    await mysqlPool.execute(
      "UPDATE categories SET category_name = ?, category_slug = ?, image_url = ?, display_order = ?, is_active = ? WHERE id = ?",
      [category_name, category_slug, image_url, display_order, is_active, id],
    );

    res.json({ success: true, data: null, message: "Category updated" });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await mysqlPool.execute("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ success: true, data: null, message: "Category deleted" });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};
