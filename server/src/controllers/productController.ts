import { Request, Response } from "express";
import mysqlPool from "../database/mysql";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const [products] = await mysqlPool.execute(`
      SELECT p.id, p.category_id, p.product_name, p.product_slug, p.base_price, 
             p.description, p.image_url, p.is_available, p.best_seller, c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    res.json({ success: true, data: products, message: "Products fetched" });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, data: null, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [products] = await mysqlPool.execute(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );

    if ((products as any).length === 0) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Product not found" });
    }

    const [sizes] = await mysqlPool.execute(
      "SELECT id, size_name, price_modifier, is_default FROM sizes WHERE product_id = ?",
      [id],
    );

    res.json({
      success: true,
      data: { ...(products as any)[0], sizes },
      message: "Product details",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, data: null, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      category_id,
      product_name,
      product_slug,
      base_price,
      description,
      image_url,
      sizes,
    } = req.body;

    if (!product_name || !product_slug || base_price === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: "Missing required fields",
        });
    }

    // Check if slug already exists
    const [existingProducts] = await mysqlPool.execute(
      "SELECT id FROM products WHERE product_slug = ?",
      [product_slug]
    );

    if ((existingProducts as any).length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: `Slug '${product_slug}' đã tồn tại. Vui lòng sử dụng slug khác.`,
        });
    }

    const [result] = await mysqlPool.execute(
      "INSERT INTO products (category_id, product_name, product_slug, base_price, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [
        category_id || null,
        product_name,
        product_slug,
        base_price,
        description || null,
        image_url || null,
      ],
    );

    const productId = (result as any).insertId;

    // Insert sizes if provided
    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      for (const size of sizes) {
        await mysqlPool.execute(
          "INSERT INTO sizes (product_id, size_name, price_modifier, is_default) VALUES (?, ?, ?, ?)",
          [
            productId,
            size.size_name,
            size.price_modifier || 0,
            size.is_default || false,
          ],
        );
      }
    }

    res.json({
      success: true,
      data: { id: productId },
      message: "Product created",
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      product_name,
      product_slug,
      base_price,
      description,
      image_url,
      is_available,
      best_seller,
      sizes,
    } = req.body;

    // Check if new slug conflicts with another product
    const [conflictingProducts] = await mysqlPool.execute(
      "SELECT id FROM products WHERE product_slug = ? AND id != ?",
      [product_slug, id]
    );

    if ((conflictingProducts as any).length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: `Slug '${product_slug}' đã tồn tại. Vui lòng sử dụng slug khác.`,
        });
    }

    await mysqlPool.execute(
      "UPDATE products SET category_id = ?, product_name = ?, product_slug = ?, base_price = ?, description = ?, image_url = ?, is_available = ?, best_seller = ? WHERE id = ?",
      [
        category_id,
        product_name,
        product_slug,
        base_price,
        description,
        image_url,
        is_available,
        best_seller,
        id,
      ],
    );

    // Update sizes if provided
    if (sizes && Array.isArray(sizes)) {
      // Delete existing sizes
      await mysqlPool.execute("DELETE FROM sizes WHERE product_id = ?", [id]);

      // Insert new sizes
      for (const size of sizes) {
        await mysqlPool.execute(
          "INSERT INTO sizes (product_id, size_name, price_modifier, is_default) VALUES (?, ?, ?, ?)",
          [
            id,
            size.size_name,
            size.price_modifier || 0,
            size.is_default || false,
          ],
        );
      }
    }

    res.json({ success: true, data: null, message: "Product updated" });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await mysqlPool.execute("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true, data: null, message: "Product deleted" });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, data: null, message: error.message });
  }
};
