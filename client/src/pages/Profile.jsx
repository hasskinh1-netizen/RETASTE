import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";
import { User, Mail, Phone, Save, AlertCircle } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Initialize form with user data
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.name.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }

    if (!form.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email không đúng định dạng");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/auth/profile", {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      if (response.data.success) {
        setSuccess("Cập nhật hồ sơ thành công!");
        // Update user in AuthContext
        login(response.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">Hồ sơ cá nhân</h1>
        <p className="mt-3 text-slate-600">
          Quản lý thông tin tài khoản và cập nhật hồ sơ của bạn
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 flex gap-3 text-rose-700">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                ✓ {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Họ và tên */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User size={16} />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Nhập email"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Phone size={16} />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Account Info */}
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin tài khoản</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Vai trò</p>
                <p className="font-medium text-slate-900">
                  {user?.role === "customer" ? "Khách hàng" : user?.role}
                </p>
              </div>
              <div>
                <p className="text-slate-600">ID Người dùng</p>
                <p className="font-medium text-slate-900">{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Đăng xuất
            </button>
          </div>

          {/* Help */}
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Cần trợ giúp?</h3>
            <p className="text-sm text-slate-600">
              Liên hệ với chúng tôi qua email hoặc điện thoại để được hỗ trợ.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Email: support@retaste.local
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;
