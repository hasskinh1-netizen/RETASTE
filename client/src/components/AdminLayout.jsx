import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
  LogOut,
  Menu,
  X,
  Package,
  Settings,
  User,
  CreditCard,
} from "lucide-react";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("retaste_token");
    localStorage.removeItem("retaste_user_role");
    navigate("/admin/login");
  };

  const adminMenuItems = [
    { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
    { label: "Doanh thu", icon: DollarSign, path: "/admin/revenue" },
    { label: "Đơn hàng", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Giao hàng", icon: Truck, path: "/admin/delivery" },
    { label: "Quản lý lương", icon: CreditCard, path: "/admin/payroll" },
    { label: "Nhân viên", icon: Users, path: "/admin/staff" },
    { label: "Sản phẩm", icon: Package, path: "/admin/products" },
    { label: "Cài đặt", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed md:static top-0 left-0 h-screen bg-[#2f4858] text-white transition-all duration-300 flex flex-col z-50`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-700 p-4">
          <h2
            className={`font-bold text-lg ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            RETASTE
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-slate-800 transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f26b3a] rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-slate-300">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto space-y-1 p-3">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#f26b3a] text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col w-full md:ml-0 ml-0">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
