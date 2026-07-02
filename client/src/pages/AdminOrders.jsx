import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import {
  Search,
  CalendarDays,
  RefreshCcw,
  Settings2,
  Eye,
  Edit2,
  Download,
  CreditCard,
  User,
} from "lucide-react";

const statusMetadata = {
  all: { label: "Tất cả", color: "bg-emerald-100 text-emerald-800" },
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800" },
  preparing: { label: "Đang chuẩn bị", color: "bg-slate-100 text-slate-700" },
  delivering: { label: "Đang giao hàng", color: "bg-sky-100 text-sky-800" },
  completed: { label: "Đã giao", color: "bg-emerald-100 text-emerald-800" },
  canceled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800" },
};

const summaryCounts = {
  all: 156,
  pending: 18,
  preparing: 23,
  delivering: 40,
  completed: 65,
  canceled: 10,
};

const mockOrders = [
  {
    id: "ORD-2311",
    customer: "Trần Minh",
    phone: "0987654321",
    time: "2026-05-01 09:32",
    total: 325000,
    payment: "VNPAY",
    status: "pending",
  },
  {
    id: "ORD-2309",
    customer: "Nguyễn Lan",
    phone: "0912345678",
    time: "2026-05-01 09:05",
    total: 198000,
    payment: "Tiền mặt",
    status: "preparing",
  },
  {
    id: "ORD-2307",
    customer: "Lê Anh",
    phone: "0978123456",
    time: "2026-05-01 08:57",
    total: 450000,
    payment: "Thẻ tín dụng",
    status: "delivering",
  },
  {
    id: "ORD-2303",
    customer: "Phạm Hồng",
    phone: "0909123456",
    time: "2026-05-01 08:15",
    total: 120000,
    payment: "VNPAY",
    status: "completed",
  },
  {
    id: "ORD-2298",
    customer: "Ngô Thị",
    phone: "0945678912",
    time: "2026-04-30 19:32",
    total: 285000,
    payment: "Tiền mặt",
    status: "canceled",
  },
  {
    id: "ORD-2294",
    customer: "Đặng Sơn",
    phone: "0933456789",
    time: "2026-04-30 18:50",
    total: 390000,
    payment: "Thẻ tín dụng",
    status: "delivering",
  },
  {
    id: "ORD-2290",
    customer: "Mai Phương",
    phone: "0981234567",
    time: "2026-04-30 17:40",
    total: 215000,
    payment: "VNPAY",
    status: "preparing",
  },
  {
    id: "ORD-2287",
    customer: "Huỳnh Trâm",
    phone: "0967890123",
    time: "2026-04-30 16:55",
    total: 305000,
    payment: "Tiền mặt",
    status: "pending",
  },
];

function StatusBadge({ status }) {
  const meta = statusMetadata[status] || statusMetadata.pending;
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  );
}

function StatusTabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 bg-slate-100 p-4 rounded-xl shadow-sm">
      {[
        { key: "all", label: `Tất cả (${summaryCounts.all})` },
        { key: "pending", label: `Chờ xác nhận (${summaryCounts.pending})` },
        { key: "preparing", label: "Đang chuẩn bị" },
        { key: "delivering", label: "Đang giao hàng" },
        { key: "completed", label: "Đã giao" },
        { key: "canceled", label: "Đã hủy" },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            activeTab === tab.key
              ? "bg-emerald-600 text-white shadow"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function FilterPanel({ filters, setFilters, onSearch, onReset, onExport }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Từ ngày</span>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
            />
          </div>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Đến ngày</span>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
            />
          </div>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Mã đơn hàng</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nhập mã đơn"
              value={filters.orderId}
              onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Khách hàng (tên hoặc SĐT)</span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại"
            value={filters.customer}
            onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Trạng thái</span>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="delivering">Đang giao hàng</option>
            <option value="completed">Đã giao</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Phương thức thanh toán</span>
          <select
            value={filters.payment}
            onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="VNPAY">VNPAY</option>
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Thẻ tín dụng">Thẻ tín dụng</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSearch}
          className="inline-flex items-center gap-2 rounded-xl bg-[#f26b3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e55a2b]"
        >
          <Search size={16} /> Tìm kiếm
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Đặt lại
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Download size={16} /> Xuất Excel
        </button>
      </div>
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-4 py-4">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#f26b3a] focus:ring-[#f26b3a]" />
            </th>
            <th className="px-4 py-4">Mã đơn</th>
            <th className="px-4 py-4">Khách hàng</th>
            <th className="px-4 py-4">Thời gian đặt</th>
            <th className="px-4 py-4">Tổng tiền</th>
            <th className="px-4 py-4">Thanh toán</th>
            <th className="px-4 py-4">Trạng thái</th>
            <th className="px-4 py-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#f26b3a] focus:ring-[#f26b3a]" />
              </td>
              <td className="px-4 py-4">
                <button className="text-blue-600 hover:underline">{order.id}</button>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f26b3a]/15 text-[#f26b3a]">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{order.customer}</p>
                    <p className="text-sm text-slate-500">{order.phone}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">{order.time}</td>
              <td className="px-4 py-4 font-semibold text-slate-900">{order.total.toLocaleString("vi-VN")} ₫</td>
              <td className="px-4 py-4 text-slate-700">{order.payment}</td>
              <td className="px-4 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Eye size={14} /> Xem
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Edit2 size={14} /> Sửa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    orderId: "",
    customer: "",
    status: "all",
    payment: "all",
  });

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchTab = activeTab === "all" || order.status === activeTab;
      const matchOrderId = !filters.orderId || order.id.toLowerCase().includes(filters.orderId.toLowerCase());
      const matchCustomer =
        !filters.customer ||
        order.customer.toLowerCase().includes(filters.customer.toLowerCase()) ||
        order.phone.includes(filters.customer);
      const matchStatus = filters.status === "all" || order.status === filters.status;
      const matchPayment = filters.payment === "all" || order.payment === filters.payment;
      const matchFromDate = !filters.fromDate || order.time.split(" ")[0] >= filters.fromDate;
      const matchToDate = !filters.toDate || order.time.split(" ")[0] <= filters.toDate;
      return matchTab && matchOrderId && matchCustomer && matchStatus && matchPayment && matchFromDate && matchToDate;
    });
  }, [orders, activeTab, filters]);

  const handleSearch = () => {
    // Search is applied immediately through filters
  };

  const handleReset = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      orderId: "",
      customer: "",
      status: "all",
      payment: "all",
    });
    setActiveTab("all");
  };

  const handleExport = () => {
    console.log("Export Excel");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <nav className="text-sm text-slate-500">
            Trang chủ / <span className="font-semibold text-slate-900">Quản lý đơn hàng</span>
          </nav>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Quản lý Đơn Hàng</h1>
        </div>

        <div className="mt-6">
          <StatusTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            onExport={handleExport}
          />
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Danh sách đơn hàng</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{`Danh sách đơn hàng (${summaryCounts.all})`}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <RefreshCcw size={16} /> Làm mới
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Settings2 size={16} /> Cài đặt hiển thị
              </button>
            </div>
          </div>

          <div className="mt-6">
            <OrdersTable orders={filteredOrders} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
