import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";
import { Plus, Edit, Trash2, LayoutGrid } from "lucide-react";

function AdminCategoriesList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Lấy danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    try {
      await api.delete(`/products/categories/${categoryId}`);
      setCategories(categories.filter((c) => c.id !== categoryId));
      alert("Xóa danh mục thành công");
    } catch (err) {
      alert(err?.response?.data?.message || "Xóa danh mục thất bại");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white p-6 shadow-sm sticky top-0">
        <h1 className="text-3xl font-semibold text-slate-900">
          Quản lý Danh mục
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Quản lý các danh mục sản phẩm
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
                Danh sách danh mục
              </h2>
              <button
                onClick={() => navigate("/admin/categories/new")}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
                Thêm Danh mục
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <div className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-slate-500">
                    Chưa có danh mục nào. Hãy tạo danh mục mới.
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-md hover:shadow-lg transition"
                  >
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.category_name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {category.category_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Slug: {category.category_slug}
                      </p>
                      {category.description && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/categories/${category.id}/edit`)
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200 transition"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCategoriesList;
