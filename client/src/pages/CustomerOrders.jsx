import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";
import { Clock, CheckCircle, Truck, XCircle, Eye } from "lucide-react";

function CustomerOrders() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "đang chuẩn bị":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "confirmed":
      case "đã xác nhận":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "preparing":
      case "đang giao":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "delivered":
      case "hoàn thành":
      case "đã nhận":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
      case "đã hủy":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "preparing":
        return "Đang chuẩn bị";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">Đơn hàng của tôi</h1>
        <p className="mt-3 text-slate-600">
          Theo dõi trạng thái và lịch sử đơn hàng của bạn
        </p>
      </header>

      {loading ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="inline-flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
            <p className="text-slate-600">Đang tải đơn hàng...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-rose-600 mb-4" />
          <p className="text-rose-700 font-medium">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Thử lại
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Truck className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-slate-600 mb-6">
            Bạn chưa đặt đơn hàng nào. Hãy bắt đầu đặt món ngon!
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Đặt món ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status || order.order_status)}
                    <h3 className="text-lg font-semibold text-slate-900">
                      Đơn hàng #{order.id || order.order_number}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {formatDate(order.created_at || order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">
                    {(order.total_amount || order.total)?.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-sm text-slate-600">
                    {getStatusText(order.status || order.order_status)}
                  </p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-900 mb-2">
                    {order.items.length} món
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {item.name || `Món ${index + 1}`}
                        {item.quantity > 1 && ` (x${item.quantity})`}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        +{order.items.length - 3} món khác
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;