import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gift, Sparkles, AlertCircle, Copy, CheckCircle } from "lucide-react";
import api from "../services/api.js";

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get("/promotions");
        if (response.data.success) {
          setPromotions(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Không thể tải danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center text-slate-600">
            Đang tải khuyến mãi...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="pt-20 bg-background">
        {/* Header Section */}
        <section className="px-4 md:px-8 py-12 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-screen-2xl mx-auto">
            <span className="inline-block text-primary font-bold uppercase tracking-widest text-xs md:text-sm mb-4">
              ✨ Khuyến mãi nóng
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Ưu Đãi Đặc Biệt
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
              Khám phá những ưu đãi được cập nhật liên tục để bạn đặt hàng tiết kiệm hơn mỗi ngày.
            </p>
          </div>
        </section>

        {/* Promo Code Input Section */}
        <section className="px-4 md:px-8 py-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-outline-variant/20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-on-surface mb-3">Có mã giảm giá?</h2>
              <p className="text-on-surface-variant text-sm mb-4">Nhập mã giảm giá của bạn để nhận ưu đãi đặc biệt</p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  className="flex-1 px-4 py-3 rounded-xl border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  maxLength="50"
                />
                <button className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:shadow-lg transition-all whitespace-nowrap">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto">
            {error && (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-6 mb-8 flex gap-4 text-error">
                <AlertCircle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Lỗi</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {promotions.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-12 text-center">
                <p className="text-on-surface-variant text-lg">Hiện chưa có khuyến mãi nào</p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-6">
                  Hiển thị {promotions.length} khuyến mãi
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promotions.map((promo) => {
                    const isExpired = new Date(promo.end_date) < new Date();
                    const isUsageLimit = promo.usage_limit && promo.used_count >= promo.usage_limit;
                    const isDisabled = isExpired || isUsageLimit;

                    return (
                      <div
                        key={promo.id}
                        className={`rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl ${
                          isDisabled ? "opacity-60" : ""
                        }`}
                      >
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary mb-4">
                          <Gift size={24} />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h2 className="text-xl font-bold text-on-surface">
                              {promo.promo_name}
                            </h2>
                            {promo.promo_code && (
                              <p className="mt-2 text-sm text-on-surface-variant">
                                Mã: <span className="font-mono font-bold text-primary">{promo.promo_code}</span>
                              </p>
                            )}
                          </div>

                          {/* Discount info */}
                          <div className="bg-surface-container-low rounded-lg p-3">
                            {promo.discount_type === "percent" ? (
                              <p className="text-lg font-black text-error">
                                Giảm {promo.discount_value}%
                                {promo.max_discount && ` (tối đa ${promo.max_discount.toLocaleString("vi-VN")}₫)`}
                              </p>
                            ) : (
                              <p className="text-lg font-black text-error">
                                Giảm {promo.discount_value.toLocaleString("vi-VN")}₫
                              </p>
                            )}
                            {promo.min_order_value > 0 && (
                              <p className="text-xs text-on-surface-variant mt-1">
                                Đơn hàng tối thiểu: {promo.min_order_value.toLocaleString("vi-VN")}₫
                              </p>
                            )}
                          </div>

                          <p className="text-on-surface-variant text-sm">{promo.description}</p>

                          {/* Expiry info */}
                          <div className="text-xs text-on-surface-variant space-y-1">
                            <p>Có hiệu lực đến: {formatDate(promo.end_date)}</p>
                            {promo.usage_limit && (
                              <p>
                                Đã sử dụng: {promo.used_count}/{promo.usage_limit}
                              </p>
                            )}
                          </div>

                          {/* Status badges */}
                          <div className="flex flex-wrap gap-2">
                            {isExpired && (
                              <span className="text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-medium">
                                Hết hạn
                              </span>
                            )}
                            {isUsageLimit && (
                              <span className="text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-medium">
                                Hết lượt dùng
                              </span>
                            )}
                            {!isDisabled && (
                              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                Có sẵn
                              </span>
                            )}
                          </div>

                          {/* Copy code button */}
                          {promo.promo_code && !isDisabled && (
                            <button
                              onClick={() => handleCopyCode(promo.promo_code)}
                              className="w-full mt-4 rounded-xl bg-primary text-on-primary px-4 py-3 text-sm font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              {copiedCode === promo.promo_code ? (
                                <>
                                  <CheckCircle size={16} />
                                  Đã sao chép!
                                </>
                              ) : (
                                <>
                                  <Copy size={16} />
                                  Sao chép mã
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-900 text-white font-['Be_Vietnam_Pro']">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">RETASTE</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nền tảng khuyến mãi ưu đãi, mang đến trải nghiệm ẩm thực tiết kiệm.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold text-white mb-4">Khám phá</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Thực đơn</Link></li>
                <li><Link to="/recommendations" className="hover:text-white transition-colors">Gợi ý</Link></li>
                <li><Link to="/combo" className="hover:text-white transition-colors">Combo</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Liên hệ</h4>
              <p className="text-slate-400 text-sm mb-2">📧 hello@retaste.vn</p>
              <p className="text-slate-400 text-sm">📱 1900 1234</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-400 text-sm">
            <p>© 2024 RETASTE. Nghệ thuật ẩm thực tinh tế.</p>
            <p>Được thiết kế bởi RETASTE Team</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Promotions;
