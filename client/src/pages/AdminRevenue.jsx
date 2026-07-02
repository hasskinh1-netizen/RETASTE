import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";

function AdminRevenue() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/revenue")
      .then((response) => setReport(response.data.data))
      .catch(() => setError("Không thể tải báo cáo doanh thu."));
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white p-6 shadow-sm sticky top-0">
        <h1 className="text-3xl font-semibold text-slate-900">Quản lý Doanh thu</h1>
        <p className="mt-1 text-sm text-slate-600">Theo dõi tổng doanh thu của hệ thống</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">
          Báo cáo doanh thu
        </h1>
        <p className="mt-3 text-slate-600">
          Tổng hợp doanh thu theo ngày, tuần và tháng.
        </p>
      </header>
      {error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : !report ? (
        <div className="rounded-[32px] bg-white p-10 text-center text-slate-600 shadow-sm">
          Đang tải báo cáo...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Hôm nay
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {report.today.toLocaleString("vi-VN")}₫
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Tuần này
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {report.thisWeek.toLocaleString("vi-VN")}₫
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Tháng này
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {report.thisMonth.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      )}
      </div>
      </div>
    </AdminLayout>
  );
}

export default AdminRevenue;
