import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../services/api.js";

function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories").catch(() => ({ data: { data: [] } }))
        ]);
        
        setItems(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        setError("Không thể tải menu. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item) =>
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((item) => item.category_id === selectedCategory);
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
    }
    // "popular" - keep original order

    return result;
  }, [items, searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <main className="pt-20 bg-background">
        {/* Header Section */}
        <section className="px-4 md:px-8 py-12 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-screen-2xl mx-auto">
            <span className="inline-block text-primary font-bold uppercase tracking-widest text-xs md:text-sm mb-4">
              🍽️ Thực đơn
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Menu Phong Phú
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
              Khám phá những món ăn ngon tuyệt nhất được chọn lọc kỹ lưỡng. Tìm kiếm, lọc, và chọn ngay món yêu thích của bạn.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="px-4 md:px-8 py-8 bg-white border-b border-outline-variant/20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="flex items-center bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/30 focus-within:border-primary transition-colors">
                  <Search className="w-5 h-5 text-outline mr-2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên món ăn..."
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
                <option value="popular">Phổ biến nhất</option>
                <option value="price-low">Giá: Thấp → Cao</option>
                <option value="price-high">Giá: Cao → Thấp</option>
              </select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedCategory === null
                      ? "bg-primary text-on-primary shadow-md"
                      : "bg-surface-container text-on-surface border border-outline-variant/30 hover:bg-surface-container-high"
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedCategory === category.id
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container text-on-surface border border-outline-variant/30 hover:bg-surface-container-high"
                    }`}
                  >
                    {category.name || category.category_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] rounded-2xl bg-surface-container mb-4"></div>
                    <div className="h-4 bg-surface-container rounded mb-2"></div>
                    <div className="h-4 bg-surface-container rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-8 text-center text-error">
                <p className="font-semibold mb-2">❌ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tải lại trang
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-12 text-center">
                <p className="text-on-surface-variant text-lg">
                  {searchTerm || selectedCategory
                    ? "Không tìm thấy món ăn phù hợp"
                    : "Chưa có sản phẩm"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-6">
                  Hiển thị {filteredItems.length} món ăn
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                        <div className="aspect-[4/5] overflow-hidden bg-surface-container">
                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                            }
                            alt={item.product_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      <div className="px-2">
                        <h3 className="text-lg font-bold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.product_name}
                        </h3>
                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2 h-10">
                          {item.description || "Món ăn ngon từ RETASTE"}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-black text-primary">
                              {item.base_price?.toLocaleString("vi-VN")}
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
                Nền tảng đặt đồ ăn cá nhân hóa, mang đến trải nghiệm ẩm thực tinh tế.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold text-white mb-4">Khám phá</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Thực đơn</Link></li>
                <li><Link to="/combo" className="hover:text-white transition-colors">Combo</Link></li>
                <li><Link to="/recommendations" className="hover:text-white transition-colors">Gợi ý</Link></li>
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

export default Menu;
