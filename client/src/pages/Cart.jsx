import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { Trash2, Plus, Minus, Check, X } from "lucide-react";
import { useState } from "react";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
    useCart();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const total = getTotalPrice();
  const discountedTotal = Math.max(0, total - discountAmount);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      alert("Vui lòng nhập mã khuyến mãi");
      return;
    }
    // Mock: Tính toán giảm giá (thực tế sẽ gọi API)
    // Ví dụ: giảm 10% hoặc giảm cố định
    const mockDiscount = Math.floor(total * 0.1); // Giảm 10%
    setAppliedPromo(promoCode);
    setDiscountAmount(mockDiscount);
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode("");
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <h1 className="text-4xl font-semibold text-slate-900">Giỏ hàng</h1>
        <p className="mt-3 text-slate-600">
          Kiểm tra đơn hàng và tiến hành thanh toán nhanh.
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center">
          <p className="text-lg text-slate-600">Giỏ hàng của bạn đang trống</p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            {cartItems.map((item) => (
              <div
                key={`${item.product_id}-${item.selectedSize}`}
                className="flex items-start gap-4 rounded-3xl border border-slate-100 p-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded-2xl bg-slate-100"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.product_name}
                  </h2>
                  {item.selectedSize && (
                    <p className="text-sm text-slate-500">
                      Kích thước: {item.selectedSize}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    Giá: {item.base_price?.toLocaleString("vi-VN")}₫ / cái
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          item.selectedSize,
                          item.quantity - 1
                        )
                      }
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          item.selectedSize,
                          item.quantity + 1
                        )
                      }
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="block text-base font-semibold text-slate-900 whitespace-nowrap">
                      {(
                        item.base_price * item.quantity
                      ).toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.product_id, item.selectedSize)
                    }
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded flex-shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm h-fit sticky top-8">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Tổng thanh toán
            </p>

            {/* Promo Code Section */}
            <div className="mt-6 space-y-4 pb-6 border-b border-slate-200">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Dán mã khuyến mãi..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    disabled={appliedPromo !== null}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={appliedPromo !== null}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Applied Promo Info */}
              {appliedPromo && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {appliedPromo}
                      </p>
                      <p className="text-xs text-green-700">
                        Giảm {discountAmount.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="p-1 hover:bg-green-100 rounded text-green-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-medium">{total.toLocaleString("vi-VN")}₫</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Giảm giá:</span>
                  <span className="font-medium">-{discountAmount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Tổng cộng:</span>
                <span>{discountedTotal.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="mt-8 w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Thanh toán ngay
            </button>
            <button
              onClick={clearCart}
              className="mt-4 w-full rounded-3xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Xóa giỏ hàng
            </button>
            <Link
              to="/menu"
              className="mt-4 block text-center text-sm text-slate-700 underline underline-offset-2"
            >
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
