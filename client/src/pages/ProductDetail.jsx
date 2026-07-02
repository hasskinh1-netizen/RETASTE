import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/products/${id}`)
      .then((response) => {
        const product = response.data.data;
        setProduct(product);
        // Set default size nếu có
        if (product.sizes && product.sizes.length > 0) {
          const defaultSize = product.sizes.find((s) => s.is_default);
          setSelectedSize(defaultSize ? defaultSize.id : product.sizes[0].id);
        }

        // Record viewed dish for recommendations
        if (isAuthenticated) {
          api.post('/recommendations/record-view', { foodId: parseInt(id) })
            .catch(err => console.log('Failed to record view:', err));
        }
      })
      .catch(() => setError("Không tìm thấy sản phẩm"))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    // Check authentication
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (!product) return;
    
    setAddingToCart(true);
    try {
      addToCart(product, quantity, selectedSize);
      alert(`Đã thêm "${product.product_name}" vào giỏ hàng!`);
      // Reset form
      setQuantity(1);
    } catch (err) {
      alert("Lỗi khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[32px] bg-white p-10 text-center text-slate-600 shadow-sm">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-[32px] bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
        {error || "Sản phẩm không tồn tại"}
      </div>
    );
  }

  return (
    <main className="pt-20 bg-background min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Product Info */}
          <div className="order-1 lg:order-1">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
              <div className="rounded-[32px] overflow-hidden bg-slate-100">
                <img
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={product.product_name}
                  className="h-[300px] md:h-[420px] w-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="text-lg leading-8 text-slate-600">
                  {product.description || "Mô tả sản phẩm chưa được cung cấp."}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <aside className="order-2 lg:order-2 space-y-6 rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            {/* Product Name & Price */}
            <div className="border-b border-slate-200 pb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {product.product_name}
              </h1>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-600">Giá:</span>
                <span className="text-3xl font-bold text-slate-900">
                  {product.base_price?.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Order Details Header */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Chi tiết đơn hàng
          </h2>
          <p className="mt-3 text-slate-600">
            Thêm sản phẩm vào giỏ và thanh toán nhanh chóng.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            ⚠️ Vui lòng <Link to="/login" className="font-semibold underline">đăng nhập</Link> để tiếp tục mua hàng
          </div>
        )}

        {/* Chọn kích thước */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kích thước
            </label>
            <select
              value={selectedSize || ""}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              disabled={!isAuthenticated}
            >
              {product.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.size_name} (+{size.price_modifier?.toLocaleString("vi-VN")}₫)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chọn số lượng */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Số lượng
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!isAuthenticated}
              className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300 disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              disabled={!isAuthenticated}
              className="w-16 text-center border border-slate-200 rounded disabled:opacity-50"
              min="1"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!isAuthenticated}
              className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart || !isAuthenticated}
          className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
        </button>
        <Link
          to="/cart"
          className="block text-center text-sm font-medium text-slate-900 underline underline-offset-2"
        >
          Xem giỏ hàng
        </Link>
      </aside>
    </div>
    </div>
    </main>
  );
}

export default ProductDetail;
