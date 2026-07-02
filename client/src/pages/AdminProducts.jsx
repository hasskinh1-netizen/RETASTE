import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";

const sampleProducts = [
  {
    id: "PROD-001",
    name: "Cà phê đen đá",
    image: null,
    category: "Đồ uống",
    price: 25000,
    description: "Cà phê đen đá pha phin truyền thống",
    status: "Còn",
    createdAt: "2024-01-15",
  },
  {
    id: "PROD-002",
    name: "Bánh mì thịt nướng",
    image: null,
    category: "Đồ ăn",
    price: 35000,
    description: "Bánh mì thịt nướng với rau và nước sốt đặc biệt",
    status: "Còn",
    createdAt: "2024-01-20",
  },
  {
    id: "PROD-003",
    name: "Trà sữa trân châu",
    image: null,
    category: "Đồ uống",
    price: 45000,
    description: "Trà sữa trân châu đường đen size lớn",
    status: "Hết",
    createdAt: "2024-02-01",
  },
  {
    id: "PROD-004",
    name: "Salad gà nướng",
    image: null,
    category: "Đồ ăn",
    price: 55000,
    description: "Salad gà nướng với rau tươi và sốt chanh dây",
    status: "Còn",
    createdAt: "2024-02-10",
  },
  {
    id: "PROD-005",
    name: "Sinh tố bơ",
    image: null,
    category: "Đồ uống",
    price: 40000,
    description: "Sinh tố bơ tươi với sữa đặc",
    status: "Còn",
    createdAt: "2024-02-15",
  },
];

const statusStyles = {
  "Còn": "bg-emerald-100 text-emerald-800",
  "Hết": "bg-rose-100 text-rose-800",
};

const categories = ["Tất cả", "Đồ uống", "Đồ ăn", "Tráng miệng"];

function HeaderSection({ onAddProduct }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Trang chủ / Sản phẩm</p>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">Quản lý sản phẩm</h1>
        </div>
        <button
          onClick={onAddProduct}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
}

function KPICards({ stats }) {
  const cards = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      change: "+12%",
      changeType: "positive",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Danh mục",
      value: stats.categories,
      change: "+2",
      changeType: "positive",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Doanh thu hôm nay",
      value: `${stats.todayRevenue.toLocaleString("vi-VN")}₫`,
      change: "+8.2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Đơn hàng mới",
      value: stats.newOrders,
      change: "+15",
      changeType: "positive",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.bgColor}`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${card.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.change}
              </p>
            </div>
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function FilterSection({ category, onChange }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Danh mục:</label>
          <select
            value={category}
            onChange={(e) => onChange("category", e.target.value)}
            className="rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ProductTable({ data, onEdit, onDelete, onView }) {
  const formatCurrency = (value) => `${value.toLocaleString("vi-VN")} ₫`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="rounded-[12px] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 md:px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Danh sách sản phẩm
            </p>
            <h2 className="mt-2 text-lg md:text-xl font-semibold text-slate-900">Sản phẩm ({data.length})</h2>
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        <div className="divide-y divide-slate-200">
          {data.map((product) => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-semibold">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.category}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[product.status]}`}>
                  {product.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Giá</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(product.price)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Ngày tạo</p>
                  <p className="font-semibold text-slate-900">{formatDate(product.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  {product.description}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(product)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Mã SP</th>
              <th className="px-6 py-4 font-semibold">Sản phẩm</th>
              <th className="px-6 py-4 font-semibold">Danh mục</th>
              <th className="px-6 py-4 font-semibold text-right">Giá</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-center">Ngày tạo</th>
              <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="px-6 py-5 font-semibold text-slate-900">{product.id}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-700">{product.category}</td>
                <td className="px-6 py-5 text-right font-semibold text-slate-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center text-slate-700">{formatDate(product.createdAt)}</td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => onView(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "Đồ uống",
    price: "",
    description: "",
    status: "Còn",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price.toString(),
      });
    } else {
      setFormData({
        name: "",
        image: null,
        category: "Đồ uống",
        price: "",
        description: "",
        status: "Còn",
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseInt(formData.price) || 0,
    };
    onSave(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên sản phẩm
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ảnh sản phẩm
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-[12px] bg-slate-50 cursor-pointer hover:border-[#f26b3a] transition"
              >
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Click để upload ảnh</p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
            >
              <option value="Còn">Còn</option>
              <option value="Hết">Hết</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-full bg-[#f26b3a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f26b3a]/90"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "Tất cả",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    api
      .get("/admin/products")
      .then((response) => {
        const payload = response.data.data;
        setProducts(Array.isArray(payload) && payload.length ? payload : sampleProducts);
      })
      .catch(() => {
        setProducts(sampleProducts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filters.category === "Tất cả" || product.category === filters.category;
      return matchesCategory;
    });
  }, [filters, products]);

  const stats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const categories = new Set(filteredProducts.map(p => p.category)).size;
    const todayRevenue = filteredProducts.reduce((sum, product) => {
      // Giả lập doanh thu hôm nay (20% sản phẩm được bán)
      return sum + (product.price * 0.2 * Math.random());
    }, 0);
    const newOrders = Math.floor(Math.random() * 50) + 10; // Giả lập số đơn hàng mới

    return {
      totalProducts,
      categories,
      todayRevenue: Math.round(todayRevenue),
      newOrders,
    };
  }, [filteredProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleViewProduct = (product) => {
    // TODO: Implement view product details
    console.log("View product:", product);
  };

  const handleDeleteProduct = (product) => {
    // TODO: Implement delete product
    console.log("Delete product:", product);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(prod =>
        prod.id === editingProduct.id ? { ...productData, id: editingProduct.id, createdAt: editingProduct.createdAt } : prod
      ));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
        <div className="space-y-4 md:space-y-6">
          <HeaderSection onAddProduct={handleAddProduct} />
          <KPICards stats={stats} />
          <FilterSection category={filters.category} onChange={handleFilterChange} />

          {loading ? (
            <div className="rounded-[12px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <ProductTable
              data={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
            />
          )}
        </div>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </AdminLayout>
  );
}

export default AdminProducts;
