import { useEffect, useState } from "react";
import api from "../services/api.js";

function StaffDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/staff/dashboard")
      .then((response) => setDashboard(response.data.data))
      .catch(() => setError("Không tải được dashboard nhân viên."));
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">
          Dashboard Nhân viên
        </h1>
        <p className="mt-3 text-slate-600">
          Tổng quan công việc, đơn hàng và ca trực hôm nay.
        </p>
      </header>
      {error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : !dashboard ? (
        <div className="rounded-[32px] bg-white p-10 text-center text-slate-600 shadow-sm">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Đơn hôm nay
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {dashboard.todayOrders}
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Hoàn thành
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {dashboard.completedOrders}
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Ca tiếp theo
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {dashboard.nextShift}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
