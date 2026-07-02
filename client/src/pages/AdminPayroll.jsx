import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Edit3,
  Trash2,
  User,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";

const samplePayroll = [
  {
    id: "PAY-001",
    name: "Nguyễn Văn A",
    email: "vana@retaste.local",
    position: "Nhân viên bán hàng",
    baseSalary: 12000000,
    bonus: 1500000,
    deductions: 250000,
    overtimeHours: 12,
    payrollDate: "2026-05-01",
    status: "Đã thanh toán",
    totalSalary: 12000000 + 1500000 - 250000 + Math.round((12000000 / 160) * 12 * 1.5),
  },
  {
    id: "PAY-002",
    name: "Trần Thị B",
    email: "thib@retaste.local",
    position: "Nhân viên phục vụ",
    baseSalary: 10500000,
    bonus: 900000,
    deductions: 180000,
    overtimeHours: 8,
    payrollDate: "2026-05-02",
    status: "Chờ thanh toán",
    totalSalary: 10500000 + 900000 - 180000 + Math.round((10500000 / 160) * 8 * 1.5),
  },
  {
    id: "PAY-003",
    name: "Lê Hoàng C",
    email: "hoangc@retaste.local",
    position: "Thu ngân",
    baseSalary: 12500000,
    bonus: 1200000,
    deductions: 300000,
    overtimeHours: 10,
    payrollDate: "2026-05-03",
    status: "Đã thanh toán",
    totalSalary: 12500000 + 1200000 - 300000 + Math.round((12500000 / 160) * 10 * 1.5),
  },
  {
    id: "PAY-004",
    name: "Phạm Minh D",
    email: "minhd@retaste.local",
    position: "Quản lý ca",
    baseSalary: 16000000,
    bonus: 2100000,
    deductions: 400000,
    overtimeHours: 6,
    payrollDate: "2026-05-04",
    status: "Chờ thanh toán",
    totalSalary: 16000000 + 2100000 - 400000 + Math.round((16000000 / 160) * 6 * 1.5),
  },
  {
    id: "PAY-005",
    name: "Đặng Thị E",
    email: "the@retaste.local",
    position: "Nhân viên bếp",
    baseSalary: 11200000,
    bonus: 1000000,
    deductions: 220000,
    overtimeHours: 14,
    payrollDate: "2026-05-05",
    status: "Đã thanh toán",
    totalSalary: 11200000 + 1000000 - 220000 + Math.round((11200000 / 160) * 14 * 1.5),
  },
];

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")} ₫`;

const statusStyles = {
  "Đã thanh toán": "bg-emerald-100 text-emerald-800",
  "Chờ thanh toán": "bg-amber-100 text-amber-800",
};

function HeaderSection({ fromDate, toDate, status, onChange }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Trang chủ / Quản lý lương</p>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">Bảng quản lý lương</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-2 text-sm text-slate-600">
            <span>Ngày bắt đầu</span>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onChange("fromDate", e.target.value)}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            <span>Ngày kết thúc</span>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => onChange("toDate", e.target.value)}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2 lg:col-span-1">
            <span>Trạng thái</span>
            <select
              value={status}
              onChange={(e) => onChange("status", e.target.value)}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
            >
              <option value="all">Tất cả</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

function SummaryCards({ totals }) {
  const cards = [
    {
      title: "Số nhân viên",
      value: totals.staffCount,
      accent: "bg-[#f26b3a]/10 text-[#f26b3a]",
    },
    {
      title: "Tổng lương cơ bản",
      value: formatCurrency(totals.baseSalary),
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Tổng thưởng",
      value: formatCurrency(totals.bonus),
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Tổng chi trả",
      value: formatCurrency(totals.totalSalary),
      accent: "bg-[#f26b3a]/10 text-[#f26b3a]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-5 shadow-sm"
        >
          <div className={`inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl ${card.accent}`}>
            <User size={18} />
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function PayrollTable({ data }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 md:px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Bảng lương nhân viên tháng 05/2026
            </p>
            <h2 className="mt-2 text-lg md:text-xl font-semibold text-slate-900">Danh sách chi trả</h2>
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        <div className="divide-y divide-slate-200">
          {data.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f26b3a]/10 text-[#f26b3a] font-semibold text-sm">
                  {item.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                  <p className="text-xs text-slate-600">{item.position}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                  {item.status === "Đã thanh toán" ? (
                    <CheckCircle size={12} />
                  ) : (
                    <User size={12} />
                  )}
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Lương cơ bản</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.baseSalary)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Thưởng</p>
                  <p className="font-semibold text-emerald-700">+{formatCurrency(item.bonus)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Khấu trừ</p>
                  <p className="font-semibold text-rose-600">-{formatCurrency(item.deductions)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Giờ làm thêm</p>
                  <p className="font-semibold text-slate-700">{item.overtimeHours}h</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-500">Tổng lương</p>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(item.totalSalary)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                    <Edit3 size={14} />
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Nhân viên</th>
              <th className="px-6 py-4 font-semibold text-right">Lương cơ bản</th>
              <th className="px-6 py-4 font-semibold text-right">Thưởng</th>
              <th className="px-6 py-4 font-semibold text-right">Khấu trừ</th>
              <th className="px-6 py-4 font-semibold text-center">Giờ làm thêm</th>
              <th className="px-6 py-4 font-semibold text-right">Tổng lương</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="px-6 py-5 font-semibold text-slate-900">{item.id}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f26b3a]/10 text-[#f26b3a] font-semibold">
                      {item.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-semibold text-slate-900">
                  {formatCurrency(item.baseSalary)}
                </td>
                <td className="px-6 py-5 text-right text-emerald-700 font-semibold">
                  +{formatCurrency(item.bonus)}
                </td>
                <td className="px-6 py-5 text-right text-rose-600 font-semibold">
                  -{formatCurrency(item.deductions)}
                </td>
                <td className="px-6 py-5 text-center text-slate-700">{item.overtimeHours}h</td>
                <td className="px-6 py-5 text-right font-semibold text-slate-900">
                  {formatCurrency(item.totalSalary)}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[item.status]}`}>
                    {item.status === "Đã thanh toán" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <User size={16} />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                      <Edit3 size={16} />
                    </button>
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummarySection({ totals }) {
  const summaryItems = [
    { label: "Tổng nhân viên", value: totals.staffCount },
    { label: "Tổng lương", value: formatCurrency(totals.totalSalary) },
    { label: "Tổng thưởng", value: formatCurrency(totals.bonus) },
    { label: "Tổng khấu trừ", value: formatCurrency(totals.deductions) },
    { label: "Phí làm thêm", value: formatCurrency(totals.overtimeCost) },
    { label: "Tổng chi trả", value: formatCurrency(totals.totalSalary) },
  ];

  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">Tổng kết chi trả lương tháng</h2>
          <p className="mt-2 text-sm text-slate-500">Tổng chi phí lương và các khoản thưởng khấu trừ.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 md:px-5 py-2 md:py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
          Phê duyệt
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-[12px] border border-slate-200 bg-slate-50 p-3 md:p-4">
            <p className="text-sm text-slate-600">{item.label}</p>
            <p className="mt-2 md:mt-3 text-lg md:text-2xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPayroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", status: "all" });

  useEffect(() => {
    api
      .get("/admin/payroll")
      .then((response) => {
        const payload = response.data.data;
        setPayroll(Array.isArray(payload) && payload.length ? payload : samplePayroll);
      })
      .catch(() => {
        setPayroll(samplePayroll);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredPayroll = useMemo(() => {
    return payroll.filter((item) => {
      const date = new Date(item.payrollDate);
      if (filters.fromDate && date < new Date(filters.fromDate)) return false;
      if (filters.toDate && date > new Date(filters.toDate)) return false;
      if (filters.status === "paid") return item.status === "Đã thanh toán";
      if (filters.status === "pending") return item.status === "Chờ thanh toán";
      return true;
    });
  }, [filters, payroll]);

  const totals = useMemo(() => {
    const baseSalary = filteredPayroll.reduce((sum, item) => sum + item.baseSalary, 0);
    const bonus = filteredPayroll.reduce((sum, item) => sum + item.bonus, 0);
    const deductions = filteredPayroll.reduce((sum, item) => sum + item.deductions, 0);
    const overtimeCost = filteredPayroll.reduce(
      (sum, item) => sum + Math.round((item.baseSalary / 160) * item.overtimeHours * 1.5),
      0
    );
    const totalSalary = filteredPayroll.reduce((sum, item) => sum + item.totalSalary, 0);

    return {
      staffCount: filteredPayroll.length,
      baseSalary,
      bonus,
      deductions,
      overtimeCost,
      totalSalary,
    };
  }, [filteredPayroll]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
        <div className="space-y-4 md:space-y-6">
          <HeaderSection
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            status={filters.status}
            onChange={handleFilterChange}
          />
          <SummaryCards totals={totals} />

          {loading ? (
            <div className="rounded-[12px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <PayrollTable data={filteredPayroll} />
          )}

          <SummarySection totals={totals} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPayroll;
