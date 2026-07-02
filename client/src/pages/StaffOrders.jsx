import { useEffect, useState } from "react";
import api from "../services/api.js";

function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/staff/orders")
      .then((response) => setOrders(response.data.data || []))
      .catch(() => setError("Không tải được đơn hàng nhân viên."));
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">Đơn hàng trực</h1>
        <p className="mt-3 text-slate-600">
          Xem và xử lý đơn hàng được giao hiện tại.
        </p>
      </header>
      {error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Đơn #{order.id}
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {order.status}
                </span>
              </div>
              <p className="mt-3 text-slate-600">Khách: {order.customer}</p>
              <p className="text-sm text-slate-500">ETA: {order.eta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffOrders;
