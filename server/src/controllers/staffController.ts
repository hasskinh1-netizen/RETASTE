import { Request, Response } from "express";

export const getStaffDashboard = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      todayOrders: 18,
      completedOrders: 12,
      pendingSupport: 3,
      nextShift: "08:00 - 16:00",
    },
    message: "Staff dashboard loaded",
  });
};

export const getStaffOrders = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      { id: 401, customer: "Phan Thị G", status: "Đang giao", eta: "15 phút" },
      {
        id: 402,
        customer: "Hoàng Văn H",
        status: "Đang chuẩn bị",
        eta: "20 phút",
      },
    ],
    message: "Staff order list loaded",
  });
};

export const getStaffSchedule = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      { date: "2026-04-08", shift: "08:00 - 16:00", role: "Giao hàng" },
      { date: "2026-04-09", shift: "10:00 - 18:00", role: "Pha chế" },
    ],
    message: "Staff schedule loaded",
  });
};

export const getStaffFeedback = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      {
        id: 1,
        from: "Khách hàng A",
        message: "Thêm cỡ lớn cho trà sữa",
        status: "Chưa xử lý",
      },
      {
        id: 2,
        from: "Khách hàng B",
        message: "Giao hàng nên nhanh hơn",
        status: "Đang xử lý",
      },
    ],
    message: "Feedback list loaded",
  });
};
