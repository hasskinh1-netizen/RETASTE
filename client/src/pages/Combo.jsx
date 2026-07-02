import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";
import { ShoppingCart, AlertCircle } from "lucide-react";

function Combo() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await api.get("/combos");
        if (response.data.success) {
          setCombos(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching combos:", err);
        setError("Không thể tải danh sách combo");
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const handleAddCombo = (combo) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm combo vào giỏ hàng");
      navigate("/login");
      return;
    }

    // Thêm combo như một sản phẩm
    addToCart(
      {
        id: combo.id,
        product_name: combo.combo_name,
        base_price: combo.combo_price,
        image_url: combo.image_url,
        description: combo.description,
      },
      1,
      null
    );
    alert(`Đã thêm combo "${combo.combo_name}" vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center text-slate-600">
            Đang tải combo...
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
              🎁 Combo ưu đãi
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Gói Combo Tiết Kiệm
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
              Khám phá các gói combo được thiết kế dành cho gia đình và cặp đôi với giá tiết kiệm hơn.
            </p>
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

            {combos.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-12 text-center">
                <p className="text-on-surface-variant text-lg">Hiện chưa có combo nào</p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-6">
                  Hiển thị {combos.length} combo
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {combos.map((combo) => {
                    const discountPercent = Math.round(
                      ((combo.original_price - combo.combo_price) / combo.original_price) * 100
                    );
                    return (
                      <div
                        key={combo.id}
                        className="group rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {combo.image_url && (
                          <div className="rounded-xl overflow-hidden bg-surface-container h-48 mb-4">
                            <img
                              src={combo.image_url}
                              alt={combo.combo_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="relative">
                          {discountPercent > 0 && (
                            <div className="absolute -top-8 right-0 bg-error text-on-error px-3 py-1 rounded-full text-sm font-bold">
                              -{discountPercent}%
                            </div>
                          )}

                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                            Combo
                          </span>
                          <h2 className="mt-2 text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                            {combo.combo_name}
                          </h2>
                          <p className="mt-2 text-on-surface-variant text-sm line-clamp-2">
                            {combo.description}
                          </p>

                          {/* Items trong combo */}
                          {combo.items && combo.items.length > 0 && (
                            <div className="mt-4 bg-surface-container-low rounded-lg p-3">
                              <p className="text-xs font-semibold text-on-surface mb-2">Gồm:</p>
                              <ul className="text-xs text-on-surface-variant space-y-1">
                                {combo.items.map((item, idx) => (
                                  <li key={idx}>• {item.product_name}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="mt-6 space-y-2">
                            {combo.original_price > combo.combo_price && (
                              <div className="flex gap-2 items-center">
                                <span className="text-sm line-through text-on-surface-variant">
                                  {combo.original_price.toLocaleString("vi-VN")}₫
                                </span>
                              </div>
                            )}
                            <span className="text-2xl font-black text-primary">
                              {combo.combo_price.toLocaleString("vi-VN")}₫
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddCombo(combo)}
                            className="w-full mt-4 rounded-xl bg-primary text-on-primary px-4 py-3 text-sm font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={16} />
                            Thêm vào giỏ
                          </button>
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
                Nền tảng gợi ý combo ưu đãi, mang đến trải nghiệm ẩm thực tiết kiệm.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold text-white mb-4">Khám phá</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Thực đơn</Link></li>
                <li><Link to="/recommendations" className="hover:text-white transition-colors">Gợi ý</Link></li>
                <li><Link to="/promotions" className="hover:text-white transition-colors">Khuyến mãi</Link></li>
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

export default Combo;
