import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import api from "../services/api.js";

function Recommendation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/recommendations");
        setItems(response.data.data || []);
      } catch (err) {
        setError("Không thể tải gợi ý món. Vui lòng đăng nhập và thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedFilter !== "all") {
      result = result.filter((item) => item.category === selectedFilter);
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    // "recommended" - keep original order

    return result;
  }, [items, searchTerm, selectedFilter, sortBy]);

  return (
    <>
      <main className="pt-20 bg-background">
        {/* Header Section */}
        <section className="px-4 md:px-8 py-12 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-screen-2xl mx-auto">
            <span className="inline-block text-primary font-bold uppercase tracking-widest text-xs md:text-sm mb-4">
              ✨ Gợi ý cá nhân
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Những Món Dành Cho Bạn
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
              Khám phá những hương vị được tinh tuyển riêng dựa trên sở thích và lịch sử mua hàng của bạn. Mỗi gợi ý là một trải nghiệm ẩm thực độc đáo.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="px-4 md:px-8 py-8 bg-white border-b border-outline-variant/20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="flex items-center bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/30 focus-within:border-primary transition-colors">
                  <Search className="w-5 h-5 text-outline mr-2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm gợi ý..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                  />
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="recommended">Được gợi ý nhất</option>
                <option value="price-low">Giá: Thấp → Cao</option>
                <option value="price-high">Giá: Cao → Thấp</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  selectedFilter === "all"
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container text-on-surface border border-outline-variant/30 hover:bg-surface-container-high"
                }`}
              >
                Tất cả
              </button>
              {["Healthy", "Chính", "Vặt", "Uống"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category.toLowerCase())}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedFilter === category.toLowerCase()
                      ? "bg-primary text-on-primary shadow-md"
                      : "bg-surface-container text-on-surface border border-outline-variant/30 hover:bg-surface-container-high"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations Grid */}
        <section className="px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] rounded-2xl bg-surface-container mb-4"></div>
                    <div className="h-4 bg-surface-container rounded mb-2"></div>
                    <div className="h-4 bg-surface-container rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-12 text-center">
                <p className="text-error font-semibold mb-4">❌ {error}</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-error text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Đăng nhập để xem gợi ý
                </Link>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-12 text-center">
                <p className="text-on-surface-variant text-lg">
                  {searchTerm || selectedFilter !== "all"
                    ? "Không tìm thấy gợi ý phù hợp"
                    : "Chưa có gợi ý"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-6">
                  Hiển thị {filteredItems.length} gợi ý
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300 relative">
                        <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        {/* Favorite badge */}
                        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                          <Heart className="w-5 h-5 text-error" />
                        </button>
                      </div>

                      <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1 text-primary font-bold text-sm whitespace-nowrap ml-2">
                            <span>⭐</span>
                            <span>4.8</span>
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2 h-10">
                          {item.description || "Gợi ý đặc biệt dành cho bạn"}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-black text-primary">
                              {item.price?.toLocaleString("vi-VN")}
                            </span>
                            <span className="text-on-surface-variant ml-1">₫</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem chi tiết →
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
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
                Nền tảng gợi ý món ăn cá nhân hóa, mang đến trải nghiệm ẩm thực tinh tế.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold text-white mb-4">Khám phá</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Thực đơn</Link></li>
                <li><Link to="/combo" className="hover:text-white transition-colors">Combo</Link></li>
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

export default Recommendation;
