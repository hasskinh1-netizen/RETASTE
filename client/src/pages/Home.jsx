import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";

function Home() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }
    addToCart(product, 1);
    alert(`Đã thêm "${product.product_name}" vào giỏ hàng!`);
  };

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-8 pt-12 pb-24 max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] text-on-surface mb-8">
                RETASTE Gợi ý món ăn <span className="text-primary-dim italic font-serif">yêu thích</span> cho bạn
              </h1>
              <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed">
                Khám phá thực đơn cá nhân hóa dựa trên khẩu vị và sức khỏe của riêng bạn. Trải nghiệm ẩm thực tinh tế mỗi ngày cùng RETASTE.
              </p>
              <div className="flex flex-wrap gap-4 mb-16">
                <Link to="/recommendations" className="bg-primary-gradient text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-transform duration-300 hover:scale-105 shadow-xl">
                  Xem gợi ý món
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
                <Link to="/menu" className="bg-surface-container-high text-primary px-8 py-4 rounded-xl font-bold transition-transform duration-300 hover:scale-105">
                  Khám phá menu
                </Link>
              </div>
              {/* Quick Order Mini Cards */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                <div className="flex-shrink-0 w-48 bg-surface-container-lowest p-3 rounded-xl shadow-[0_10px_30px_rgba(26,31,46,0.04)] group">
                  <div className="h-28 w-full rounded-lg overflow-hidden mb-3">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="vibrant healthy salad bowl with avocado and quinoa artistic plating" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=60"} />
                  </div>
                  <h4 className="text-sm font-bold truncate">Salad Bơ Nhiệt Đới</h4>
                  <p className="text-xs text-primary font-bold mt-1">125.000đ</p>
                </div>
                <div className="flex-shrink-0 w-48 bg-surface-container-lowest p-3 rounded-xl shadow-[0_10px_30px_rgba(26,31,46,0.04)] group">
                  <div className="h-28 w-full rounded-lg overflow-hidden mb-3">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="gourmet salmon poke bowl with fresh ingredients and colorful garnishes" src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=400&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=60"} />
                  </div>
                  <h4 className="text-sm font-bold truncate">Poke Hồi Thượng Hạng</h4>
                  <p className="text-xs text-primary font-bold mt-1">185.000đ</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden aspect-[4/5] relative">
                <img className="w-full h-full object-cover" alt="close-up of exquisite gourmet dish slow cooked wagyu beef with microgreens artistic plating bright airy lighting" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=60"} />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/20 to-transparent"></div>
              </div>
              {/* Floating Special Card */}
              <div className="absolute -top-8 -left-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div>
                  <p className="text-xs text-outline font-bold uppercase tracking-widest">Today's Special</p>
                  <h3 className="font-bold text-on-surface">Bò Wagyu Áp Chảo</h3>
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-8 rounded-xl shadow-2xl grid grid-cols-1 gap-6 min-w-[280px]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">restaurant</span>
                  <div>
                    <p className="text-lg font-black leading-none">150+</p>
                    <p className="text-xs text-outline">Món ăn đa dạng</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                  <div>
                    <p className="text-lg font-black leading-none">24/7</p>
                    <p className="text-xs text-outline">Gợi ý nhanh chóng</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <div>
                    <p className="text-lg font-black leading-none">Lalamove</p>
                    <p className="text-xs text-outline">Giao hàng Hỗ trợ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Recommendations Section */}
        <section className="bg-surface-container-low py-24 rounded-t-[4rem]">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">Cá nhân hóa</span>
                <h2 className="text-4xl font-black tracking-tight mt-2">Gợi ý cho bạn</h2>
              </div>
              <Link className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all" to="/recommendations">
                Xem tất cả gợi ý <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Recommendation Card 1 */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_20px_40px_rgba(26,31,46,0.06)] group cursor-pointer">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-5">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="modern vegetable dish with edible flowers and purees minimalist fine dining aesthetic" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60"} />
                  <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase">Phù hợp với bạn</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Ức Gà Nướng Mật Ong</h3>
                <p className="text-on-surface-variant text-sm mb-4">Giàu đạm, ít béo, kèm rau củ nướng</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">145.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 1,
                      product_name: "Ức Gà Nướng Mật Ong",
                      base_price: 145000,
                      image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm hover:shadow-md transition-all"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>
              {/* Recommendation Card 2 */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_20px_40px_rgba(26,31,46,0.06)] group cursor-pointer">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-5">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="classic artisan pizza with buffalo mozzarella and fresh basil leaves overhead view" src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1571407-918286ecaaf1?auto=format&fit=crop&w=500&q=60"} />
                  <span className="absolute top-4 left-4 bg-error text-on-error text-[10px] px-3 py-1 rounded-full font-bold uppercase">Bán chạy</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Pizza Napoli Đặc Biệt</h3>
                <p className="text-on-surface-variant text-sm mb-4">Bột ủ 24h, phô mai thượng hạng</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">210.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 2,
                      product_name: "Pizza Napoli Đặc Biệt",
                      base_price: 210000,
                      image_url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
              {/* Recommendation Card 3 */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_20px_40px_rgba(26,31,46,0.06)] group cursor-pointer">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-5">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="tender barbecue ribs with smoky glaze and sesame seeds on wooden board" src="https://images.unsplash.com/photo-1555939594-58d7cb561621?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=60"} />
                  <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase">Phù hợp với bạn</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Sườn Nướng BBQ</h3>
                <p className="text-on-surface-variant text-sm mb-4">Sốt đặc chế từ 12 loại gia vị</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">285.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 3,
                      product_name: "Sườn Nướng BBQ",
                      base_price: 285000,
                      image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561621?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
              {/* Recommendation Card 4 */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_20px_40px_rgba(26,31,46,0.06)] group cursor-pointer">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-5">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="delicate strawberry dessert with cream and mint garnish on white plate" src="https://images.unsplash.com/photo-1488477181946-6428a0291840?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1469014365713-3611a3f1b4b4?auto=format&fit=crop&w=500&q=60"} />
                  <span className="absolute top-4 left-4 bg-error text-on-error text-[10px] px-3 py-1 rounded-full font-bold uppercase">Bán chạy</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Panna Cotta Dâu Tây</h3>
                <p className="text-on-surface-variant text-sm mb-4">Vị ngọt thanh, dâu tươi Đà Lạt</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">75.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 4,
                      product_name: "Panna Cotta Dâu Tây",
                      base_price: 75000,
                      image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291840?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Bento Grid Discovery */}
        <section className="py-24 max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-[700px]">
            <div className="md:col-span-8 md:row-span-2 relative rounded-xl overflow-hidden group shadow-2xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="professional chef plating a delicate dish in a high-end restaurant kitchen cinematic lighting" src="https://images.unsplash.com/photo-1577195643202-4fa352f4b4c1?auto=format&fit=crop&w=800&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1495195134817-aeb325ef1d1b?auto=format&fit=crop&w=800&q=60"} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                <h3 className="text-white text-4xl font-black mb-4">Khám phá Nghệ thuật Ẩm thực</h3>
                <p className="text-white/80 text-lg max-w-md mb-8">Mỗi món ăn là một câu chuyện được kể bởi những đầu bếp hàng đầu.</p>
                <Link to="/menu" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold w-fit hover:bg-primary hover:text-on-primary transition-all">Đặt ngay</Link>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-xl overflow-hidden group shadow-xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="overhead shot of multiple healthy brunch dishes on a white table" src="https://images.unsplash.com/photo-1585238341710-4b4e6ceea06b?auto=format&fit=crop&w=400&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=60"} />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/combo" className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-6 py-2 rounded-full font-bold">Xem</Link>
              </div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white font-bold text-xl">Combo Gia Đình</h4>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-xl overflow-hidden group shadow-xl">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="close up of refreshing craft cocktails with ice and fruit garnish" src="https://images.unsplash.com/photo-1536599018199-ab3dc32212b3?auto=format&fit=crop&w=400&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1609953227369-694b63d1b982?auto=format&fit=crop&w=400&q=60"} />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/menu" className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-6 py-2 rounded-full font-bold">Xem</Link>
              </div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white font-bold text-xl">Đồ Uống Đặc Biệt</h4>
              </div>
            </div>
          </div>
        </section>
        {/* Menu Grid */}
        <section className="py-24 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="text-center mb-20">
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">Thực đơn</span>
              <h2 className="text-5xl font-black tracking-tighter mt-4">Lựa chọn của bạn</h2>
              <div className="flex justify-center gap-4 mt-12 flex-wrap">
                <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold">Tất cả</button>
                <button className="bg-surface-container text-on-surface-variant px-8 py-3 rounded-full font-bold hover:bg-surface-variant transition-colors">Món chính</button>
                <button className="bg-surface-container text-on-surface-variant px-8 py-3 rounded-full font-bold hover:bg-surface-variant transition-colors">Khai vị</button>
                <button className="bg-surface-container text-on-surface-variant px-8 py-3 rounded-full font-bold hover:bg-surface-variant transition-colors">Tráng miệng</button>
                <button className="bg-surface-container text-on-surface-variant px-8 py-3 rounded-full font-bold hover:bg-surface-variant transition-colors">Đồ uống</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {/* Menu Item 1 */}
              <div className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 shadow-lg">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="pancakes with honey and berries stacked neatly on white plate" src="https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1513184869697-8f8f6ebc596e?auto=format&fit=crop&w=500&q=60"} />
                </div>
                <h3 className="text-xl font-bold mb-2">Bánh Pancakes Mật Ong</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Bánh mềm mịn dùng kèm mật ong nguyên chất và trái cây tươi theo mùa.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">95.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 5,
                      product_name: "Bánh Pancakes Mật Ong",
                      base_price: 95000,
                      image_url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
              {/* Menu Item 2 */}
              <div className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 shadow-lg">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="gourmet chicken salad with grilled vegetables and light dressing" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=60"} />
                </div>
                <h3 className="text-xl font-bold mb-2">Salad Gà Nướng Sốt Mè</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Gà ta nướng thảo mộc, xà lách giòn, sốt mè rang Nhật Bản đậm đà.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">120.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 6,
                      product_name: "Salad Gà Nướng Sốt Mè",
                      base_price: 120000,
                      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
              {/* Menu Item 3 */}
              <div className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 shadow-lg">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="delicious pasta with tomato sauce and fresh parmesan cheese" src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1612874742237-6526221fcf10?auto=format&fit=crop&w=500&q=60"} />
                </div>
                <h3 className="text-xl font-bold mb-2">Mỳ Ý Sốt Cà Chua</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Sợi mỳ Al Dente, sốt cà chua hầm 8 tiếng cùng thịt bò băm tươi.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">165.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 7,
                      product_name: "Mỳ Ý Sốt Cà Chua",
                      base_price: 165000,
                      image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
              {/* Menu Item 4 */}
              <div className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 shadow-lg">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="exquisite bowl of vegetable soup with garnish and herbs" src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1537521557990-76f2b810b319?auto=format&fit=crop&w=500&q=60"} />
                </div>
                <h3 className="text-xl font-bold mb-2">Súp Rau Củ Kem Tươi</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Súp sánh mịn, vị béo của kem tươi quyện cùng rau củ thanh mát.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">85.000đ</span>
                  <button
                    onClick={() => handleAddToCart({
                      product_id: 8,
                      product_name: "Súp Rau Củ Kem Tươi",
                      base_price: 85000,
                      image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60"
                    })}
                    className="bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full py-12 rounded-t-[3rem] bg-slate-100 dark:bg-slate-950 font-['Be_Vietnam_Pro'] text-sm">
        <div className="max-w-screen-2xl mx-auto px-12">
          <div className="flex flex-col md:flex-row justify-between mb-16 space-y-12 md:space-y-0">
            <div className="max-w-xs">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 block">RETASTE</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                RETASTE – nền tảng đặt đồ ăn cá nhân hóa, mang đến trải nghiệm ẩm thực tinh tế và an tâm cho sức khỏe người dùng.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform" href="#">
                  <img className="w-5 h-5" alt="facebook icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6-5wtEuvgs3cEf-Pt95RJifKB3elKVpvNw9fvYK9uNmDZM7YaYqeEhQpjq1c9-RrKqGB0sm_IRtTiMwKXQWWnnI3NBfICwlPANCz6fNzOdp7EJyjzhlQKEZmnX6PEVkEzKLmZ0eG01GZZoTxYUjnZimD760o6gdu6ygjuLDukCgeW6N9UlVTLmXakVGzM0t-6iAZOPuwTIQov259v67ulOvBGtdqDGAkMpvwQC3Kq8l3oqhiwD5Wyfaa2CrkbuAEZ6EAq2tPjNkk"/>
                </a>
                <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform" href="#">
                  <img className="w-5 h-5" alt="instagram icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ggIpSqgrDa3z9ehKEGLupdboV1CPkOhTokjPXk7O9qErjtFLUEf3QuI19ippL6txykJbX2VWJQUAiCgJMjEwaAF4ht2DBoCGdPpCzDxpsukZq61HaQ4HKlb1NNuATcpozXbPskYXWvwUso5Szi3EKjR1N8ohljVizf8-7-ErE07WI87XLlbNThWKK_xmadiInxY2dB8zWI07VljU9fy6e20inWEPW4aBcGGhywWaQwLTDZ3y1wxbuhyH0TOHOrWDhXAcnFVEaAU"/>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Khám phá</h4>
                <ul className="space-y-4 text-slate-600">
                  <li><Link className="hover:text-slate-900 transition-opacity" to="/">Trang chủ</Link></li>
                  <li><Link className="hover:text-slate-900 transition-opacity" to="/menu">Thực đơn</Link></li>
                  <li><Link className="hover:text-slate-900 transition-opacity" to="/recommendations">Gợi ý</Link></li>
                  <li><Link className="hover:text-slate-900 transition-opacity" to="/combo">Combo</Link></li>
                  <li><Link className="hover:text-slate-900 transition-opacity" to="/promotions">Khuyến mãi</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Hỗ trợ</h4>
                <ul className="space-y-4 text-slate-600">
                  <li><a className="hover:text-slate-900 transition-opacity" href="#">Liên hệ</a></li>
                  <li><a className="hover:text-slate-900 transition-opacity" href="#">Điều khoản</a></li>
                  <li><a className="hover:text-slate-900 transition-opacity" href="#">Chính sách bảo mật</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold text-slate-900 mb-6">Tải ứng dụng</h4>
                <div className="flex flex-col gap-4">
                  <a className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:scale-105 transition-transform" href="#">
                    <img className="w-8 h-8" alt="app store icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPSXyEMkcIFjJw6R0ZwBteeuvAhk8LxBCaAHvaGuM_uZJ09SWKtzzPbsHSuqVkM2MmjBdN5mwd12PE23nkgzzaN4Lc4WzSNicHzviQk8g-YKsuSIXwj-aFKhNgIw0OSxkLwsuWrI2DISTGUugttScrFNDck_0W9VsEaHYgtm2Nw4J_BDefgjK6-TmnL6L_cpG7TTgopcXEnY6LGLB1m4xwl8kjq7f1ksQLw5WZGIM2q-temsnDkFtJbvsJTVphv2IgExX0CAhLpRk"/>
                    <div>
                      <p className="text-[10px] uppercase opacity-60">Download on the</p>
                      <p className="text-sm font-bold">App Store</p>
                    </div>
                  </a>
                  <a className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:scale-105 transition-transform" href="#">
                    <img className="w-8 h-8" alt="google play icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIiJOkLTsRldul_-nsIu97KQC2vH9kGJX0s62Qj7aJhTcWlYySJuIx2SWHT0nI3iDNrRFFerpNGLvzk_z6yeWydWCFzEln5Rg3qRODpYeur6aOpndAHLMZFaNDFA_8g0uk98poBdMdjUNhXG7pIE_ZSc0PYh5GCG_3I_DHnK8YaghVKktlGWxlK1OLA04CdF9AA5RU-SCWB9t2VAZueF--DTbK9jpcuBw4iOA_gwDGCYwGHPjguDIrx9aU8StpFJpd6H_9cqWqL4o"/>
                    <div>
                      <p className="text-[10px] uppercase opacity-60">Get it on</p>
                      <p className="text-sm font-bold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-slate-500">© 2024 RETASTE. Nghệ thuật ẩm thực tinh tế.</p>
          <div className="flex gap-8">
            <span className="material-symbols-outlined text-slate-400 hover:text-slate-900 cursor-pointer">language</span>
            <span className="font-bold text-slate-900">Tiếng Việt</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
