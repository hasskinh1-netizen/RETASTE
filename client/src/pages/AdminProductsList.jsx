import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";
import { Plus, Edit, Trash2 } from "lucide-react";

function AdminProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [location]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Lấy danh sách sản phẩm thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      alert("Xóa sản phẩm thành công");
    } catch (err) {
      alert(err?.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white p-6 shadow-sm sticky top-0">
        <h1 className="text-3xl font-semibold text-slate-900">
          Quản lý Sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Xem, thêm, sửa và xóa sản phẩm
        </p>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-slate-200 mx-auto mb-4 animate-pulse"></div>
              <p className="text-slate-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách sản phẩm
              </h2>
              <button
                onClick={() => navigate("/admin/products/new")}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
                Thêm Sản phẩm
              </button>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-lg">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Tên Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        Chưa có sản phẩm nào. Hãy tạo một sản phẩm mới.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {product.product_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {product.category_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {product.base_price?.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.is_available ? "Có sẵn" : "Hết hàng"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/${product.id}/edit`)
                            }
                            className="inline-flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                          >
                            <Edit className="w-4 h-4" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
