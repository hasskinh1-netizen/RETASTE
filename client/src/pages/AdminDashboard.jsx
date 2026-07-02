import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";
import {
  ShoppingCart,
  DollarSign,
  Truck,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Bell,
  HelpCircle,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/orders"),
    ])
      .then(([dashRes, ordersRes]) => {
        setSummary(dashRes.data.data);
        setOrders(ordersRes.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dashboard.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("retaste_token");
    localStorage.removeItem("retaste_user_role");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-slate-200 mx-auto mb-4 animate-pulse"></div>
            <p className="text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700 m-6">
          {error}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center px-10 w-full sticky top-0 z-40 bg-white/80 backdrop-blur-xl h-20 border-b border-slate-200">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-slate-400 transition-all outline-none placeholder-slate-400"
              placeholder="Tìm kiếm giao dịch, món ăn hoặc nhân viên..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell size={20} className="text-slate-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <HelpCircle size={20} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">Admin User</p>
              <p className="text-[10px] text-slate-500">Quản trị viên</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="p-10 max-w-7xl mx-auto space-y-10">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-bold text-slate-600 tracking-widest uppercase mb-2">
                Chào buổi sáng, Admin
              </p>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                Thống kê <span className="text-slate-400">hôm nay.</span>
              </h1>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95">
              Tải báo cáo chi tiết
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Doanh thu</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {summary && (summary.revenue / 1000000).toFixed(1)}M
                </h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-3">
                <TrendingUp size={16} />
                <span>+12.5% so với tháng trước</span>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Đơn hàng</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {summary?.totalOrders || 0}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-3">
                <TrendingUp size={16} />
                <span>+5.2%</span>
              </div>
            </div>

            {/* New Customers Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Khách hàng mới</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">523</h3>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-3">
                <TrendingDown size={16} />
                <span>Ổn định</span>
              </div>
            </div>

            {/* Delivery Rate Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Tỷ lệ giao hàng</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">95.8%</h3>
              </div>
              <div className="flex items-center gap-1 text-rose-600 text-xs font-bold mt-3">
                <TrendingDown size={16} />
                <span>-1.2%</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-8">
                <h4 className="text-xl font-black text-slate-900">Doanh thu theo thời gian</h4>
                <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold py-2 px-4 focus:ring-0 outline-none">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                </select>
              </div>
              <div className="h-72 w-full flex items-end justify-between gap-4 px-2">
                {[40, 65, 55, 85, 75, 95, 60].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-200 rounded-t-xl hover:bg-slate-900 transition-colors"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 px-2 uppercase tracking-tighter">
                <span>T.hai</span>
                <span>T.ba</span>
                <span>T.tư</span>
                <span>T.năm</span>
                <span>T.sáu</span>
                <span>T.bảy</span>
                <span>Chủ nhật</span>
              </div>
            </div>

            {/* Category Chart */}
            <div className="bg-slate-900 text-white p-10 rounded-2xl shadow-lg">
              <h4 className="text-xl font-black mb-8">Danh mục bán chạy</h4>
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 border-[16px] border-white/10 rounded-full"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">42%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hải sản</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-slate-400">Hải sản</span>
                  </div>
                  <span className="font-bold">42%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <span className="text-slate-400">Đồ nướng</span>
                  </div>
                  <span className="font-bold">28%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <span className="text-slate-400">Món tráng miệng</span>
                  </div>
                  <span className="font-bold">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-xl font-black text-slate-900">Đơn hàng gần đây</h4>
              <Link to="/admin/orders" className="text-slate-900 text-sm font-bold hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-8 py-4">Mã đơn hàng</th>
                    <th className="px-8 py-4">Khách hàng</th>
                    <th className="px-8 py-4">Ngày đặt</th>
                    <th className="px-8 py-4 text-right">Tổng cộng</th>
                    <th className="px-8 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.slice(0, 3).map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-sm font-black text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-8 py-5 text-sm font-bold">{order.customer}</td>
                      <td className="px-8 py-5 text-sm text-slate-500">
                        {new Date(order.updated).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-right text-slate-900">
                        {order.total.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            order.status === "Xác nhận"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Đang giao"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Two-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="text-xl font-black text-slate-900 mb-6">Hành động nhanh</h4>
              <div className="space-y-3">
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition font-medium text-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} />
                    <span>Xem đơn hàng</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  to="/admin/revenue"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition font-medium text-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} />
                    <span>Xem doanh thu</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  to="/admin/payroll"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition font-medium text-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} />
                    <span>Quản lý lương</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  to="/admin/schedule"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition font-medium text-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <Truck size={20} />
                    <span>Lịch biểu</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </Link>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="text-xl font-black text-slate-900 mb-6">Hoạt động gần đây</h4>
              <div className="space-y-6 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center relative z-10">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">
                      <span className="font-bold">Đơn hàng mới:</span> {orders.length || 0} đơn hàng đang chờ xử lý.
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      VỪA XONG • BỞI HỆ THỐNG
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 bg-slate-700 text-white rounded-2xl flex items-center justify-center relative z-10">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">
                      <span className="font-bold">Doanh thu:</span> Doanh thu hôm nay là {summary && (summary.revenue / 1000000).toFixed(1)}M.
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      10:45 AM • BỞI HỆ THỐNG
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 bg-slate-600 text-white rounded-2xl flex items-center justify-center relative z-10">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">
                      <span className="font-bold">Giao hàng:</span> {summary?.activeDeliveries || 0} đơn hàng đang giao.
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      HÔM QUA • BỞI HỆ THỐNG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB Button */}
      <button
        onClick={() => navigate("/admin/orders")}
        className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-90 z-50"
      >
        <Plus size={32} />
      </button>
    </AdminLayout>
  );
}

export default AdminDashboard;
