import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="rounded-[32px] bg-white p-10 text-center text-slate-600 shadow-sm">
        <p>Không tìm thấy thông tin đơn hàng</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-xl">
        <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Đơn hàng đã được tạo thành công!
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Mã đơn hàng: <span className="font-semibold">{order.id}</span>
        </p>
        <p className="text-slate-600 mb-8">
          Chúng tôi sẽ liên hệ với bạn để xác nhận trong thời gian sớm nhất.
        </p>

        <div className="bg-slate-50 rounded-lg p-6 text-left max-w-2xl mx-auto mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Chi tiết đơn hàng
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Số lượng sản phẩm:</span>
              <span className="font-medium">
                {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tổng tiền hàng:</span>
              <span className="font-medium">
                {order.subtotal?.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Phí giao hàng:</span>
              <span className="font-medium">
                {order.shippingFee > 0
                  ? order.shippingFee.toLocaleString("vi-VN") + "₫"
                  : "Miễn phí"}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between">
              <span className="font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-green-600">
                {order.total?.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="rounded-2xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl bg-slate-200 px-8 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-300"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
