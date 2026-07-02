import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";
import { X } from "lucide-react";

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    product_name: "",
    product_slug: "",
    base_price: "",
    description: "",
    image_url: "",
    is_available: true,
    best_seller: false,
    sizes: [],
  });

  const [newSize, setNewSize] = useState({
    size_name: "",
    price_modifier: "",
    is_default: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data.data;
      setForm({
        category_id: product.category_id || "",
        product_name: product.product_name,
        product_slug: product.product_slug,
        base_price: product.base_price,
        description: product.description || "",
        image_url: product.image_url || "",
        is_available: product.is_available,
        best_seller: product.best_seller,
        sizes: product.sizes || [],
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi tải sản phẩm");
    }
  };

  const handleAddSize = () => {
    if (!newSize.size_name) {
      alert("Vui lòng nhập tên kích thước");
      return;
    }
    setForm({
      ...form,
      sizes: [
        ...form.sizes,
        { ...newSize, price_modifier: parseFloat(newSize.price_modifier) || 0 },
      ],
    });
    setNewSize({ size_name: "", price_modifier: "", is_default: false });
  };

  const handleRemoveSize = (index) => {
    setForm({
      ...form,
      sizes: form.sizes.filter((_, i) => i !== index),
    });
  };

  // Auto-generate slug từ product_name
  const generateSlug = (productName) => {
    return productName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "")
      .replace(/\-+/g, "-");
  };

  const handleProductNameChange = (e) => {
    const productName = e.target.value;
    setForm({
      ...form,
      product_name: productName,
      // Auto-update slug nếu chưa edit
      product_slug: !isEdit ? generateSlug(productName) : form.product_slug,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_name || !form.product_slug || !form.base_price) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        base_price: parseFloat(form.base_price),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        alert("Cập nhật sản phẩm thành công");
      } else {
        await api.post("/products", payload);
        alert("Thêm sản phẩm thành công");
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white p-6 shadow-sm sticky top-0">
        <h1 className="text-3xl font-semibold text-slate-900">
          {isEdit ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isEdit ? "Cập nhật thông tin sản phẩm" : "Tạo sản phẩm mới trong hệ thống"}
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow-lg p-8"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Danh mục
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên Sản phẩm *
            </label>
            <input
              type="text"
              value={form.product_name}
              onChange={handleProductNameChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Ví dụ: Phở Bò"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.product_slug}
                onChange={(e) =>
                  setForm({ ...form, product_slug: e.target.value })
                }
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Ví dụ: pho-bo"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    product_slug: generateSlug(form.product_name),
                  })
                }
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium"
              >
                Tạo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Giá cơ bản (₫) *
            </label>
            <input
              type="number"
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="40000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Mô tả chi tiết về sản phẩm..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL Hình ảnh
          </label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) =>
                  setForm({ ...form, is_available: e.target.checked })
                }
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Có sẵn</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.best_seller}
                onChange={(e) =>
                  setForm({ ...form, best_seller: e.target.checked })
                }
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Bán chạy</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quản lý Kích thước
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tên kích thước"
              value={newSize.size_name}
              onChange={(e) =>
                setNewSize({ ...newSize, size_name: e.target.value })
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-slate-900"
            />
            <input
              type="number"
              placeholder="Chênh lệch giá"
              value={newSize.price_modifier}
              onChange={(e) =>
                setNewSize({ ...newSize, price_modifier: e.target.value })
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
            >
              Thêm Kích thước
            </button>
          </div>

          {form.sizes.length > 0 && (
            <div className="space-y-2">
              {form.sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                >
                  <span className="text-sm">
                    {size.size_name}{" "}
                    {size.price_modifier > 0
                      ? `(+${size.price_modifier}₫)`
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-lg border border-slate-200 px-6 py-2 text-slate-900 font-medium hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-6 py-2 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm Sản phẩm"}
          </button>
        </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProductForm;
