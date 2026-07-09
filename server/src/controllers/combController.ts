import { Request, Response } from "express";
import mysqlPool from "../database/mysql";

export const listCombos = async (req: Request, res: Response) => {
  try {
    const connection = await mysqlPool.getConnection();

    try {
      // Get all active combos with their items
      const [combos]: any = await connection.query(
        `SELECT * FROM combos WHERE is_active = TRUE ORDER BY display_order, id`
      );

      // For each combo, get its items
      const comboList = await Promise.all(
        combos.map(async (combo: any) => {
          const [items]: any = await connection.query(
            `SELECT ci.quantity, p.id, p.product_name, p.base_price, p.image_url
             FROM combo_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.combo_id = ?`,
            [combo.id]
          );
          return {
            ...combo,
            items,
          };
        })
      );

      return res.json({
        success: true,
        data: comboList,
        message: "Combos retrieved successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error listing combos:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not retrieve combos",
    });
  }
};

export const getCombo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid combo ID",
      });
    }

    const connection = await mysqlPool.getConnection();

    try {
      const [combos]: any = await connection.query(
        "SELECT * FROM combos WHERE id = ?",
        [id]
      );

      if (!combos || combos.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Combo not found",
        });
      }

      const combo = combos[0];

      // Get combo items
      const [items]: any = await connection.query(
        `SELECT ci.quantity, p.id, p.product_name, p.base_price, p.image_url, p.description
         FROM combo_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.combo_id = ?`,
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...combo,
          items,
        },
        message: "Combo retrieved successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error getting combo:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not retrieve combo",
    });
  }
};
