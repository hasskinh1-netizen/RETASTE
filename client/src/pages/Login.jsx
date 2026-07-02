import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api, { setAuthToken } from "../services/api.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Vui lòng nhập email và mật khẩu");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email không đúng định dạng");
      return false;
    }

    setError("");
    return true;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      return;
    }

    const oauthLogin = async () => {
      setLoading(true);
      try {
        setAuthToken(token);
        const response = await api.get("/auth/me");
        const userData = response.data.data;
        login(userData);
        navigate("/menu");
      } catch (err) {
        setError("Đăng nhập bằng Google/Facebook không thành công.");
      } finally {
        setLoading(false);
      }
    };

    oauthLogin();
  }, [location.search, login, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/login", form);
      const token = response.data.data.token;
      const userData = response.data.data.user;
      const role = userData.role;

      if (role !== "customer") {
        setError(
          "Tài khoản này không phải khách hàng. Vui lòng sử dụng trang đăng nhập admin hoặc nhân viên chuyên dụng.",
        );
        return;
      }

      // Save to AuthContext
      login(userData);

      // Save token
      setAuthToken(token);
      localStorage.setItem("retaste_user_role", role);
      localStorage.setItem("retaste_token", token);

      navigate("/menu");
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/60">
        <h1 className="text-3xl font-semibold text-slate-900">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-500">
          Đăng nhập để sử dụng tài khoản khách hàng và nhận gợi ý cá nhân hóa.
        </p>

        {error && (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Nhập email"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Mật khẩu
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Nhập mật khẩu"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-slate-500">Hoặc đăng nhập nhanh bằng</p>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.assign(
                  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/google`,
                );
              }}
              className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Đăng nhập bằng Google
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.assign(
                  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/facebook`,
                );
              }}
              className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Đăng nhập bằng Facebook
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-slate-900 hover:text-slate-700"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
