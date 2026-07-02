import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api, { setAuthToken } from "../services/api.js";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null); // null = not checked, true = available, false = taken

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    // Check if email availability has been checked and is not available
    if (emailAvailable === false) {
      setError("Email đã được đăng ký");
      return false;
    }

    setError("");
    return true;
  };

  const checkEmailAvailability = async () => {
    if (!form.email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return;

    setCheckingEmail(true);
    try {
      const response = await api.post("/auth/check-email", { email: form.email });
      setEmailAvailable(response.data.data.available);
      
      if (!response.data.data.available) {
        setError("Email đã được đăng ký");
      } else {
        setError(""); // Clear any previous email error
      }
    } catch (err) {
      // If check fails, allow registration to proceed (fail gracefully)
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Register user
      const registerResponse = await api.post("/auth/register", form);
      
      if (registerResponse.data.success) {
        // Auto login after registration
        const loginResponse = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        const userData = loginResponse.data.data.user;
        const token = loginResponse.data.data.token;
        const role = userData.role;

        // Save to AuthContext
        login(userData);

        // Save token
        setAuthToken(token);
        localStorage.setItem("retaste_user_role", role);
        localStorage.setItem("retaste_token", token);

        navigate("/menu");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Đăng ký</h1>
        <p className="text-sm text-slate-500 mb-6">
          Tạo tài khoản khách hàng RETASTE để nhận gợi ý món ăn cá nhân hóa.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Họ và tên
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Nhập họ và tên"
          />

          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setEmailAvailable(null); // Reset availability when email changes
                setError(""); // Clear error when typing
              }}
              onBlur={checkEmailAvailability}
              className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-slate-200 ${
                emailAvailable === false
                  ? "border-red-300 focus:border-red-400"
                  : emailAvailable === true
                  ? "border-green-300 focus:border-green-400"
                  : "border-slate-200 focus:border-slate-400"
              }`}
              placeholder="Nhập email"
            />
            {checkingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
              </div>
            )}
            {emailAvailable === true && !checkingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                ✓
              </div>
            )}
            {emailAvailable === false && !checkingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600">
                ✗
              </div>
            )}
          </div>
          {emailAvailable === false && (
            <p className="text-xs text-red-600 mt-1">Email này đã được đăng ký</p>
          )}
          {emailAvailable === true && (
            <p className="text-xs text-green-600 mt-1">Email có thể sử dụng</p>
          )}

          <label className="block text-sm font-medium text-slate-700">
            Mật khẩu
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-slate-500">Hoặc đăng ký nhanh bằng</p>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.assign(
                  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/google`,
                );
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Đăng ký bằng Google
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.assign(
                  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/facebook`,
                );
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Đăng ký bằng Facebook
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-900 hover:text-slate-700"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
