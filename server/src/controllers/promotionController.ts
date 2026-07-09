import { Request, Response } from "express";
import mysqlPool from "../database/mysql";

export const listPromotions = async (req: Request, res: Response) => {
  try {
    const connection = await mysqlPool.getConnection();

    try {
      const [promotions]: any = await connection.query(
        `SELECT * FROM promotions 
         WHERE is_active = TRUE 
         AND end_date > NOW()
         ORDER BY created_at DESC`
      );

      return res.json({
        success: true,
        data: promotions,
        message: "Promotions retrieved successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error listing promotions:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not retrieve promotions",
    });
  }
};

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code, orderValue } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Promo code is required",
      });
    }

    const connection = await mysqlPool.getConnection();

    try {
      const [promos]: any = await connection.query(
        `SELECT * FROM promotions 
         WHERE promo_code = ? 
         AND is_active = TRUE 
         AND end_date > NOW()
         AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [code]
      );

      if (!promos || promos.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Promo code is invalid or expired",
        });
      }

      const promo = promos[0];

      // Check minimum order value
      if (orderValue && orderValue < promo.min_order_value) {
        return res.status(400).json({
          success: false,
          data: null,
          message: `Minimum order value is ${promo.min_order_value.toLocaleString(
            "vi-VN"
          )}₫`,
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (promo.discount_type === "percent") {
        discountAmount = Math.floor((orderValue * promo.discount_value) / 100);
        if (promo.max_discount && discountAmount > promo.max_discount) {
          discountAmount = promo.max_discount;
        }
      } else {
        discountAmount = promo.discount_value;
      }

      return res.json({
        success: true,
        data: {
          ...promo,
          discountAmount,
        },
        message: "Promo code is valid",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error validating promo code:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not validate promo code",
    });
  }
};
