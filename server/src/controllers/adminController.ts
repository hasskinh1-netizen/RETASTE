import { Request, Response } from "express";

export const getAdminDashboard = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      totalOrders: 245,
      revenue: 154700000,
      activeDeliveries: 18,
      activeProducts: 42,
      staffOnline: 9,
    },
    message: "Admin dashboard summary",
  });
};

export const getAdminOrders = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      {
        id: 301,
        customer: "Phạm Thị C",
        total: 108000,
        status: "Đang giao",
        updated: "2026-04-07T08:30:00Z",
      },
      {
        id: 302,
        customer: "Lê Văn D",
        total: 154000,
        status: "Xác nhận",
        updated: "2026-04-07T09:10:00Z",
      },
    ],
    message: "Admin orders loaded",
  });
};

export const getAdminRevenue = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      today: 2830000,
      thisWeek: 17500000,
      thisMonth: 72000000,
      topCategory: "Đồ uống",
    },
    message: "Revenue report loaded",
  });
};

export const getAdminProducts = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      { id: 1, name: "Trà sữa trân châu", stock: 34, price: 45000 },
      { id: 2, name: "Bánh mì kẹp thịt", stock: 21, price: 39000 },
    ],
    message: "Products loaded",
  });
};

export const getAdminPayroll = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Nguyễn Văn E",
        position: "Nhân viên giao hàng",
        baseSalary: 8500000,
        workingDays: 24,
        workingHours: 192,
        overtimeHours: 8,
        overtimeRate: 1.5,
        bonus: 500000,
        deductions: 100000,
        totalSalary: 9308000,
        status: "Đã thanh toán",
        paymentDate: "2026-04-01",
      },
      {
        id: 2,
        name: "Trần Thị F",
        position: "Nhân viên pha chế",
        baseSalary: 7800000,
        workingDays: 22,
        workingHours: 176,
        overtimeHours: 4,
        overtimeRate: 1.5,
        bonus: 300000,
        deductions: 50000,
        totalSalary: 8098000,
        status: "Chờ thanh toán",
        paymentDate: "2026-04-15",
      },
      {
        id: 3,
        name: "Hoàng Văn G",
        position: "Quản lý bếp",
        baseSalary: 10000000,
        workingDays: 25,
        workingHours: 200,
        overtimeHours: 6,
        overtimeRate: 1.5,
        bonus: 1000000,
        deductions: 200000,
        totalSalary: 10590000,
        status: "Chờ thanh toán",
        paymentDate: "2026-04-15",
      },
    ],
    message: "Payroll information loaded",
  });
};

export const getAdminSchedule = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: [
      { date: "2026-04-08", shift: "Sáng", staff: "Đội giao hàng" },
      { date: "2026-04-08", shift: "Chiều", staff: "Bếp chính" },
    ],
    message: "Admin schedule loaded",
  });
};
