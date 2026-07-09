import { Request, Response } from "express";
import {
  createLalamoveOrder,
  getDeliveryQuote,
} from "../services/lalamove.service";

export const getQuote = async (req: Request, res: Response) => {
  try {
    const { pickup, dropoff } = req.body;
    if (!pickup || !dropoff) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: "Pickup and dropoff are required",
        });
    }

    const quote = getDeliveryQuote(pickup, dropoff);
    return res.json({
      success: true,
      data: quote,
      message: "Delivery quote computed",
    });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        data: null,
        message: error.message || "Could not compute quote",
      });
  }
};

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const orderDetails = req.body;
    const result = await createLalamoveOrder(orderDetails);
    return res
      .status(201)
      .json({ success: true, data: result, message: "Lalamove order created" });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        data: null,
        message: error.message || "Could not create delivery order",
      });
  }
};
