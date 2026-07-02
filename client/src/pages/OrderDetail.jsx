import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  CreditCard,
  Phone,
  User,
} from "lucide-react";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrderDetail();
  }, [isAuthenticated, id, navigate]);

  const fetchOrderDetail = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (err) {
      setError("Không thể tải chi tiết đơn hàng");
      console.error("Error fetching order detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="h-6 w-6 text-blue-600" />;
      case "shipping":
        return <Truck className="h-6 w-6 text-orange-600" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="inline-flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
            <p className="text-slate-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-8">
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-rose-600 mb-4" />
          <p className="text-rose-700 font-medium">{error || "Đơn hàng không tồn tại"}</p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Đơn hàng #{order.id || order.order_number}
          </h1>
          <p className="text-slate-600">Đặt ngày {formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Trạng thái đơn hàng</h2>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.order_status)}`}>
                {getStatusIcon(order.order_status)}
                {getStatusText(order.order_status)}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.order_status === 'pending' || order.order_status === 'confirmed' || order.order_status === 'shipping' || order.order_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Đơn hàng đã được tạo</p>
                  <p className="text-sm text-slate-600">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {(order.order_status === 'confirmed' || order.order_status === 'shipping' || order.order_status === 'completed') && (
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.order_status === 'shipping' || order.order_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Đơn hàng đã được xác nhận</p>
                    <p className="text-sm text-slate-600">Đang chuẩn bị món ăn</p>
                  </div>
                </div>
              )}

              {(order.order_status === 'shipping' || order.order_status === 'completed') && (
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.order_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Truck className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Đang giao hàng</p>
                    <p className="text-sm text-slate-600">Đơn hàng đang được vận chuyển</p>
                  </div>
                </div>
              )}

              {order.order_status === 'completed' && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Đã hoàn thành</p>
                    <p className="text-sm text-slate-600">Cảm ơn bạn đã đặt hàng!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Chi tiết món ăn</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-600">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {(item.unit_price * item.quantity)?.toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-sm text-slate-600">
                      {item.unit_price?.toLocaleString("vi-VN")}₫ x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin thanh toán</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Thanh toán khi nhận hàng'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {order.payment_status === 'paid' ? 'Online' : 'Tiền mặt'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin giao hàng</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Địa chỉ giao hàng</p>
                  <p className="text-sm text-slate-600">{order.shipping_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tổng tiền hàng:</span>
                <span className="font-medium">
                  {(order.total_amount - (order.delivery_fee || 0))?.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Phí giao hàng:</span>
                <span className="font-medium">
                  {order.delivery_fee > 0 ? order.delivery_fee.toLocaleString("vi-VN") + "₫" : "Miễn phí"}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="font-semibold text-slate-900">Tổng cộng:</span>
                <span className="text-xl font-bold text-green-600">
                  {order.total_amount?.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;