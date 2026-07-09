import { Request, Response } from "express";
import mysqlPool from "../database/mysql";
import {
  createLalamoveOrder,
  getDeliveryQuote,
} from "../services/lalamove.service";

export const listOrders = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: any }).user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "Unauthorized" });
  }

  const connection = await mysqlPool.getConnection();

  try {
    if (user.role === "customer") {
      // Get customer's real orders
      const [orders]: any = await connection.query(
        `SELECT
          o.id,
          o.order_number,
          o.total_amount,
          o.delivery_fee,
          o.shipping_address,
          o.order_status,
          o.payment_status,
          o.created_at,
          COUNT(oi.id) as item_count
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = ?
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [user.id]
      );

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order: any) => {
          const [items]: any = await connection.query(
            `SELECT
              oi.quantity,
              oi.unit_price,
              oi.subtotal,
              p.product_name AS name,
              p.image_url
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
          );

          return {
            ...order,
            items: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.unit_price,
              image_url: item.image_url,
            })),
          };
        })
      );

      return res.json({
        success: true,
        data: ordersWithItems,
        message: "Customer orders loaded",
      });
    }

    // For admin/staff, return all orders with customer info
    const [orders]: any = await connection.query(
      `SELECT
        o.id,
        o.order_number,
        o.total_amount,
        o.delivery_fee,
        o.shipping_address,
        o.order_status,
        o.payment_status,
        o.created_at,
        u.full_name as customer_name,
        COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    return res.json({
      success: true,
      data: orders,
      message: "Orders loaded for admin/staff",
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    console.error("Order fetch error details:", {
      message: error?.message,
      code: error?.code,
      sqlState: error?.sqlState,
      sqlMessage: error?.sqlMessage,
      stack: error?.stack,
    });
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not load orders",
    });
  } finally {
    connection.release();
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: any }).user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "Unauthorized" });
  }

  console.log("User from token:", user);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const connection = await mysqlPool.getConnection();

  try {
    const { items, customerInfo, subtotal, shippingFee, total, paymentMethod } = req.body;

    console.log("Order creation request:", { items, customerInfo, subtotal, shippingFee, total, paymentMethod });

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Order items are required",
      });
    }

    const normalizedItems = items.map((item: any) => ({
      product_id: item.product_id || item.id || item.productId,
      price: item.price ?? item.base_price ?? item.unit_price,
      quantity: item.quantity ?? item.qty ?? 1,
      selectedSize: item.selectedSize ?? item.size_id ?? null,
      product_name: item.product_name ?? item.name ?? null,
    }));

    console.log("Normalized order items:", normalizedItems);

    const invalidItem = normalizedItems.find(
      (item: any) =>
        !item.product_id || item.quantity == null || item.quantity <= 0 || item.price == null
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        data: {
          invalidItem,
          normalizedItems,
        },
        message: "Invalid order item data",
      });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.address) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Customer information is required",
      });
    }

    // Generate order number (e.g., ORD-20260408-001)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const orderNumber = `ORD-${dateStr}-${randomNum}`;

    // Start transaction
    await connection.beginTransaction();
    console.log("Transaction started");

    // Insert order
    const [orderResult]: any = await connection.query(
      `INSERT INTO orders (
        user_id,
        order_number,
        total_amount,
        delivery_fee,
        shipping_address,
        order_status,
        payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        orderNumber,
        total,
        shippingFee,
        `${customerInfo.address}, ${customerInfo.addressDetails || ""}, ${customerInfo.city}`,
        "pending",
        paymentMethod === "cash" ? "unpaid" : "pending",
      ]
    );

    const orderId = orderResult.insertId;
    console.log("Order inserted with ID:", orderId);

    // Insert order items
    for (const item of normalizedItems) {
      console.log("Inserting item:", item);
      await connection.query(
        `INSERT INTO order_items (
          order_id,
          product_id,
          size_id,
          quantity,
          unit_price,
          subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.selectedSize || null,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    // Commit transaction
    await connection.commit();
    console.log("Transaction committed");

    return res.status(201).json({
      success: true,
      data: {
        id: orderId,
        orderNumber,
        items: normalizedItems,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        customerInfo,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      message: "Order created successfully",
    });
  } catch (error: any) {
    // Rollback transaction on error
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error rolling back transaction:", rollbackError);
    }
    console.error("Error creating order:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      sqlState: error?.sqlState,
      sqlMessage: error?.sqlMessage,
      stack: error?.stack
    });
    return res.status(500).json({
      success: false,
      data: null,
      message: `Could not create order: ${error?.message || 'Unknown error'}`,
    });
  } finally {
    connection.release();
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid order ID",
      });
    }

    const connection = await mysqlPool.getConnection();

    try {
      // Get order
      const [orders]: any = await connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [id]
      );

      if (!orders || orders.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Order not found",
        });
      }

      const order = orders[0];

      // Get order items
      const [items]: any = await connection.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...order,
          items,
        },
        message: "Order retrieved successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error getting order:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Could not retrieve order",
    });
  }
};

export const createShippingOrder = async (req: Request, res: Response) => {
  try {
    const shippingPayload = req.body;
    const result = await createLalamoveOrder(shippingPayload);
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
        message: error.message || "Could not create Lalamove order",
      });
  }
};
