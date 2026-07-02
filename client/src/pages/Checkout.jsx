import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";
import { MapPin, Phone, User } from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phoneNumber: user?.phone || "",
    address: "",
    addressDetails: "",
    city: "Hà Nội",
    paymentMethod: "cash", // cash, card, wallet
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="rounded-[32px] bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
        <p className="mb-4">Vui lòng đăng nhập để thanh toán</p>
        <button
          onClick={() => navigate("/login")}
          className="rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center">
        <p className="text-lg text-slate-600">Giỏ hàng trống, không có sản phẩm để thanh toán</p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmitOrder = async () => {
    if (!form.fullName || !form.phoneNumber || !form.address) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.base_price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        customerInfo: {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          address: form.address,
          addressDetails: form.addressDetails,
          city: form.city,
        },
        subtotal,
        shippingFee,
        total,
        paymentMethod: form.paymentMethod,
        status: "pending",
      };

      console.log("Checkout orderData:", orderData);

      const response = await api.post("/orders", orderData);

      if (response.data.success) {
        alert("Đơn hàng đã được tạo thành công!");
        clearCart();
        
        // Chuyển đến trang thanh toán hoặc xác nhận
        navigate(`/order/${response.data.data.id}`, {
          state: { order: response.data.data },
        });
      }
    } catch (err) {
      console.error("Checkout submit error:", err);
      const serverMessage = err?.response?.data?.message;
      const details = err?.response?.data || err?.message;
      console.error("Checkout server response:", details);
      setError(
        serverMessage ||
          (typeof details === "string" ? details : JSON.stringify(details)) ||
          "Lỗi khi tạo đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">Thanh toán</h1>
        <p className="mt-3 text-slate-600">
          Nhập thông tin giao hàng và hoàn tất đơn hàng
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Form nhập thông tin */}
        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Thông tin cá nhân */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <User size={20} />
              Thông tin cá nhân
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Họ và tên (*)
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số điện thoại (*)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="0987654321"
              />
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <MapPin size={20} />
              Địa chỉ giao hàng
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thành phố / Tỉnh (*)
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ (*)
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="123 Phố Huế, Hai Bà Trưng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ghi chú thêm
              </label>
              <textarea
                name="addressDetails"
                value={form.addressDetails}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Nhập thêm thông tin (ví dụ: lầu 5, nhà A)"
              />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Phương thức thanh toán
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={form.paymentMethod === "cash"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="font-medium text-slate-900">Thanh toán khi nhận hàng</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  disabled
                  className="w-4 h-4"
                />
                <span className="font-medium text-slate-500">Thẻ tín dụng (sắp có)</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  disabled
                  className="w-4 h-4"
                />
                <span className="font-medium text-slate-500">Ví điện tử (sắp có)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={loading}
            className="w-full rounded-3xl bg-slate-900 px-6 py-3 text-lg font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>

        {/* Tóm tắt đơn hàng */}
        <aside className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm h-fit sticky top-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={`${item.product_id}-${item.selectedSize}`}
                className="flex justify-between text-sm text-slate-600"
              >
                <span>
                  {item.product_name} x{item.quantity}
                </span>
                <span>
                  {(item.base_price * item.quantity).toLocaleString("vi-VN")}₫
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tạm tính:</span>
              <span className="font-medium text-slate-900">
                {subtotal.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Phí giao hàng:</span>
              <span className="font-medium text-slate-900">
                {shippingFee > 0
                  ? shippingFee.toLocaleString("vi-VN") + "₫"
                  : "Miễn phí"}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-slate-900">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
