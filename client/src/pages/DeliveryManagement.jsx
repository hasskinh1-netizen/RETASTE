import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";
import {
  MapPin,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Star,
  Clock,
} from "lucide-react";

function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [filterShipper, setFilterShipper] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [newShipper, setNewShipper] = useState({
    name: "",
    phone: "",
    region: "",
    vehicle: "",
    rating: 5,
  });

  // Mock data for deliveries
  const mockDeliveries = [
    {
      id: 1,
      orderId: "#ORD-8842",
      customer: "Nguyễn Thành",
      address: "123 Nguyễn Hữu Cảnh, Q.1",
      status: "delivering",
      shipper: "Phạm A",
      region: "Q.1",
      phone: "0987654321",
      createdAt: "2026-04-28 10:30",
      price: 150000,
    },
    {
      id: 2,
      orderId: "#ORD-8841",
      customer: "Lê Minh Anh",
      address: "456 Lê Lợi, Q.2",
      status: "pending",
      shipper: "Trần B",
      region: "Q.2",
      phone: "0988888888",
      createdAt: "2026-04-28 10:15",
      price: 200000,
    },
    {
      id: 3,
      orderId: "#ORD-8840",
      customer: "Trần Duy",
      address: "789 Pasteur, Q.3",
      status: "completed",
      shipper: "Hoàng C",
      region: "Q.3",
      phone: "0989999999",
      createdAt: "2026-04-28 09:45",
      price: 120000,
    },
    {
      id: 4,
      orderId: "#ORD-8839",
      customer: "Phạm Minh",
      address: "321 Tôn Đức Thắng, Q.4",
      status: "cancelled",
      shipper: "Võ D",
      region: "Q.4",
      phone: "0986666666",
      createdAt: "2026-04-28 08:00",
      price: 180000,
    },
    {
      id: 5,
      orderId: "#ORD-8838",
      customer: "Nguyễn Lan",
      address: "654 Võ Văn Tần, Q.5",
      status: "ready",
      shipper: "Lý E",
      region: "Q.5",
      phone: "0987777777",
      createdAt: "2026-04-28 11:00",
      price: 250000,
    },
  ];

  // Mock data for shippers
  const mockShippers = [
    {
      id: 1,
      name: "Phạm A",
      phone: "0987654321",
      region: "Q.1",
      vehicle: "Honda SH",
      rating: 4.8,
      totalDeliveries: 156,
      activeOrders: 3,
      status: "online",
    },
    {
      id: 2,
      name: "Trần B",
      phone: "0988888888",
      region: "Q.2",
      vehicle: "Wave 110",
      rating: 4.6,
      totalDeliveries: 124,
      activeOrders: 2,
      status: "online",
    },
    {
      id: 3,
      name: "Hoàng C",
      phone: "0989999999",
      region: "Q.3",
      vehicle: "SH Mode",
      rating: 4.9,
      totalDeliveries: 189,
      activeOrders: 1,
      status: "online",
    },
    {
      id: 4,
      name: "Võ D",
      phone: "0986666666",
      region: "Q.4",
      vehicle: "Vision",
      rating: 4.5,
      totalDeliveries: 98,
      activeOrders: 0,
      status: "offline",
    },
  ];

  useEffect(() => {
    setDeliveries(mockDeliveries);
    setShippers(mockShippers);
    setLoading(false);
  }, []);

  const stats = {
    total: deliveries.length,
    delivering: deliveries.filter((d) => d.status === "delivering").length,
    completed: deliveries.filter((d) => d.status === "completed").length,
    cancelled: deliveries.filter((d) => d.status === "cancelled").length,
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchSearch =
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.shipper.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      activeTab === "all" || delivery.status === activeTab;
    const matchShipper = filterShipper === "all" || delivery.shipper === filterShipper;
    const matchRegion = filterRegion === "all" || delivery.region === filterRegion;
    const matchDate = !filterDate || delivery.createdAt.startsWith(filterDate);
    return matchSearch && matchStatus && matchShipper && matchRegion && matchDate;
  });

  const handleAddShipper = () => {
    if (newShipper.name && newShipper.phone && newShipper.region) {
      const shipper = {
        id: shippers.length + 1,
        ...newShipper,
        totalDeliveries: 0,
        activeOrders: 0,
        status: "online",
      };
      setShippers([...shippers, shipper]);
      setNewShipper({ name: "", phone: "", region: "", vehicle: "", rating: 5 });
      setShowAddShipper(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivering":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivering":
        return <Truck size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "delivering":
        return "Đang giao hàng";
      case "completed":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Chờ chuẩn bị";
      case "ready":
        return "Sẵn sàng giao";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      {/* Header Main */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <nav className="text-sm text-slate-500">
              <span>Trang chủ</span> / <span className="text-slate-900 font-medium">Quản lý giao hàng</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Quản lý giao hàng</h1>
          </div>
          <button onClick={() => setShowAddShipper(true)} className="bg-[#f26b3a] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={20} />
            Thêm shipper mới
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Mã đơn hàng, tên khách"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
            />
          </div>
          <select
            value={filterShipper}
            onChange={(e) => setFilterShipper(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
          >
            <option value="all">Shipper</option>
            {shippers.map(shipper => (
              <option key={shipper.id} value={shipper.name}>{shipper.name}</option>
            ))}
          </select>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
          >
            <option value="all">Khu vực</option>
            <option value="Q.1">Quận 1</option>
            <option value="Q.2">Quận 2</option>
            <option value="Q.3">Quận 3</option>
            <option value="Q.4">Quận 4</option>
            <option value="Q.5">Quận 5</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
          />
          <button className="bg-[#f26b3a] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-lg font-medium">
            Lọc
          </button>
          <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50">
            Đặt lại
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Tổng đơn hàng hôm nay</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              </div>
              <Truck size={40} className="text-slate-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Đang giao hàng</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.delivering}</p>
              </div>
              <Clock size={40} className="text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Đã giao thành công</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <CheckCircle size={40} className="text-green-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Đã hủy / trả về</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
              </div>
              <XCircle size={40} className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ chuẩn bị" },
            { key: "ready", label: "Sẵn sàng giao" },
            { key: "delivering", label: "Đang giao hàng" },
            { key: "completed", label: "Đã giao" },
            { key: "cancelled", label: "Đã hủy" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab.key
                  ? "bg-[#f26b3a] text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left: Shipper List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Danh sách shipper</h3>
              <div className="space-y-4">
                {shippers.map((shipper) => (
                  <div key={shipper.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-12 h-12 bg-[#f26b3a] rounded-full flex items-center justify-center text-white font-bold">
                      {shipper.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{shipper.name}</p>
                      <p className="text-sm text-slate-600">{shipper.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{shipper.rating}</span>
                        <span className="text-sm text-slate-500">• {shipper.totalDeliveries} đơn</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipper.status === "online" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {shipper.status === "online" ? "Online" : "Offline"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Danh sách đơn hàng</h3>
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Mã đơn</p>
                        <p className="font-semibold text-slate-900">{delivery.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Thời gian</p>
                        <p className="font-semibold text-slate-900">{delivery.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Tên khách</p>
                        <p className="font-semibold text-slate-900">{delivery.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Địa chỉ</p>
                        <p className="font-semibold text-slate-900">{delivery.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">SĐT</p>
                        <p className="font-semibold text-slate-900">{delivery.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Giá tiền</p>
                        <p className="font-semibold text-[#f26b3a]">{delivery.price.toLocaleString()} VND</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Shipper</p>
                        <p className="font-semibold text-slate-900">{delivery.shipper}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Trạng thái</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusLabel(delivery.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
                        Theo dõi
                      </button>
                      <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 flex items-center gap-2">
                        <Phone size={16} />
                        Gọi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Shipper Modal */}
      {showAddShipper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Thêm shipper mới</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên shipper"
                value={newShipper.name}
                onChange={(e) => setNewShipper({ ...newShipper, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newShipper.phone}
                onChange={(e) => setNewShipper({ ...newShipper, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
              />
              <select
                value={newShipper.region}
                onChange={(e) => setNewShipper({ ...newShipper, region: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
              >
                <option value="">Chọn khu vực</option>
                <option value="Q.1">Quận 1</option>
                <option value="Q.2">Quận 2</option>
                <option value="Q.3">Quận 3</option>
                <option value="Q.4">Quận 4</option>
                <option value="Q.5">Quận 5</option>
              </select>
              <input
                type="text"
                placeholder="Phương tiện"
                value={newShipper.vehicle}
                onChange={(e) => setNewShipper({ ...newShipper, vehicle: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f26b3a] outline-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddShipper}
                className="flex-1 bg-[#f26b3a] hover:bg-[#e55a2b] text-white py-2 rounded-lg font-medium"
              >
                Thêm
              </button>
              <button
                onClick={() => setShowAddShipper(false)}
                className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default DeliveryManagement;
