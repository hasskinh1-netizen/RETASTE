import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  // Tính tổng số lượng sản phẩm trong giỏ
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(26,31,46,0.06)]">
      <div className="flex justify-between items-center px-4 md:px-8 h-20 max-w-screen-2xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link
            to="/"
            className="text-2xl font-black text-slate-900 uppercase tracking-tighter hover:opacity-80 transition-opacity"
          >
            RETASTE
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 font-['Be_Vietnam_Pro'] tracking-tight">
            <Link
              to="/"
              className={`transition-colors duration-200 ${
                isActive("/")
                  ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/menu"
              className={`transition-colors duration-200 ${
                isActive("/menu")
                  ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Thực đơn
            </Link>
            <Link
              to="/recommendations"
              className={`transition-colors duration-200 ${
                isActive("/recommendations")
                  ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Gợi ý
            </Link>
            <Link
              to="/combo"
              className={`transition-colors duration-200 ${
                isActive("/combo")
                  ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Combo
            </Link>
            <Link
              to="/promotions"
              className={`transition-colors duration-200 ${
                isActive("/promotions")
                  ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Khuyến mãi
            </Link>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Search - Hidden on mobile */}
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-outline mr-2 text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder-outline-variant outline-none"
              placeholder="Tìm món ăn..."
              type="text"
            />
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-slate-900" />
            <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </Link>

          {/* User Menu or Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden sm:flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full font-semibold text-sm bg-primary-container text-on-primary-container transition-all hover:shadow-md"
              >
                <User className="w-4 h-4" />
                {user.name || "Profile"}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-16 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                  >
                    👤 Hồ sơ
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                  >
                    📋 Đơn hàng của tôi
                  </Link>
                  <hr className="my-2 border-outline-variant/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block bg-primary-container text-on-primary-container px-4 md:px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:shadow-md"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
