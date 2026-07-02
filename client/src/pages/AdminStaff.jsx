import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Edit3,
  Eye,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../services/api.js";

const sampleEmployees = [
  {
    id: "EMP-001",
    name: "Nguyễn Văn A",
    email: "vana@retaste.local",
    phone: "0123 456 789",
    department: "Phục vụ",
    position: "Nhân viên phục vụ",
    joinDate: "2024-01-15",
    status: "Đang làm việc",
    avatar: null,
  },
  {
    id: "EMP-002",
    name: "Trần Thị B",
    email: "thib@retaste.local",
    phone: "0987 654 321",
    department: "Bếp",
    position: "Đầu bếp chính",
    joinDate: "2023-08-20",
    status: "Đang làm việc",
    avatar: null,
  },
  {
    id: "EMP-003",
    name: "Lê Hoàng C",
    email: "hoangc@retaste.local",
    phone: "0912 345 678",
    department: "Thu ngân",
    position: "Thu ngân viên",
    joinDate: "2024-03-10",
    status: "Thử việc",
    avatar: null,
  },
  {
    id: "EMP-004",
    name: "Phạm Minh D",
    email: "minhd@retaste.local",
    phone: "0908 765 432",
    department: "Quản lý",
    position: "Quản lý ca",
    joinDate: "2022-11-05",
    status: "Đang làm việc",
    avatar: null,
  },
  {
    id: "EMP-005",
    name: "Đặng Thị E",
    email: "the@retaste.local",
    phone: "0933 222 111",
    department: "Phục vụ",
    position: "Nhân viên phục vụ",
    joinDate: "2023-06-18",
    status: "Nghỉ việc",
    avatar: null,
  },
];

const statusStyles = {
  "Đang làm việc": "bg-emerald-100 text-emerald-800",
  "Nghỉ việc": "bg-rose-100 text-rose-800",
  "Thử việc": "bg-amber-100 text-amber-800",
};

const departments = ["Tất cả", "Phục vụ", "Bếp", "Thu ngân", "Quản lý"];
const positions = ["Tất cả", "Nhân viên phục vụ", "Đầu bếp chính", "Thu ngân viên", "Quản lý ca"];
const statuses = ["Tất cả", "Đang làm việc", "Nghỉ việc", "Thử việc"];

function HeaderSection({ onAddEmployee }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Trang chủ / Nhân viên</p>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">Quản lý nhân viên</h1>
        </div>
        <button
          onClick={onAddEmployee}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f26b3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f26b3a]/90"
        >
          <Plus size={16} />
          Thêm nhân viên
        </button>
      </div>
    </div>
  );
}

function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
          />
        </div>

        <select
          value={filters.department}
          onChange={(e) => onChange("department", e.target.value)}
          className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filters.position}
          onChange={(e) => onChange("position", e.target.value)}
          className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f26b3a] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f26b3a]/90">
          <Search size={16} />
          Lọc
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}

function StatsCards({ stats }) {
  const cards = [
    {
      title: "Tổng nhân viên",
      value: stats.total,
      accent: "bg-[#f26b3a]/10 text-[#f26b3a]",
    },
    {
      title: "Đang làm việc",
      value: stats.working,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Nghỉ việc",
      value: stats.resigned,
      accent: "bg-rose-100 text-rose-700",
    },
    {
      title: "Thử việc",
      value: stats.probation,
      accent: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[12px] border border-slate-200 bg-white p-4 md:p-5 shadow-sm"
        >
          <div className={`inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl ${card.accent}`}>
            <Users size={18} />
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function EmployeeTable({ data, onEdit, onDelete, onView }) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(data.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id, checked) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, id]);
    } else {
      setSelectedEmployees(prev => prev.filter(empId => empId !== id));
    }
  };

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
              Danh sách nhân viên
            </p>
            <h2 className="mt-2 text-lg md:text-xl font-semibold text-slate-900">Nhân viên ({data.length})</h2>
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        <div className="divide-y divide-slate-200">
          {data.map((employee) => (
            <div key={employee.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#f26b3a] focus:ring-[#f26b3a]"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f26b3a]/10 text-[#f26b3a] font-semibold text-sm">
                  {employee.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{employee.name}</p>
                  <p className="text-xs text-slate-500">{employee.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[employee.status]}`}>
                  {employee.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Số điện thoại</p>
                  <p className="font-semibold text-slate-900">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phòng ban</p>
                  <p className="font-semibold text-slate-900">{employee.department}</p>
                </div>
                <div>
                  <p className="text-slate-500">Chức vụ</p>
                  <p className="font-semibold text-slate-900">{employee.position}</p>
                </div>
                <div>
                  <p className="text-slate-500">Ngày vào làm</p>
                  <p className="font-semibold text-slate-900">{formatDate(employee.joinDate)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(employee)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(employee)}
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
              <th className="px-6 py-4 font-semibold">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#f26b3a] focus:ring-[#f26b3a]"
                />
              </th>
              <th className="px-6 py-4 font-semibold">Nhân viên</th>
              <th className="px-6 py-4 font-semibold">Số điện thoại</th>
              <th className="px-6 py-4 font-semibold">Phòng ban</th>
              <th className="px-6 py-4 font-semibold">Chức vụ</th>
              <th className="px-6 py-4 font-semibold">Ngày vào làm</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee) => (
              <tr key={employee.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#f26b3a] focus:ring-[#f26b3a]"
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f26b3a]/10 text-[#f26b3a] font-semibold">
                      {employee.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{employee.name}</p>
                      <p className="text-xs text-slate-500">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-semibold text-slate-900">
                  {employee.phone}
                </td>
                <td className="px-6 py-5 text-slate-700">{employee.department}</td>
                <td className="px-6 py-5 text-slate-700">{employee.position}</td>
                <td className="px-6 py-5 text-slate-700">{formatDate(employee.joinDate)}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[employee.status]}`}>
                    {employee.status === "Đang làm việc" ? (
                      <CheckCircle size={16} />
                    ) : employee.status === "Nghỉ việc" ? (
                      <X size={16} />
                    ) : (
                      <User size={16} />
                    )}
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => onView(employee)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
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

function EmployeeModal({ isOpen, onClose, employee, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Phục vụ",
    position: "Nhân viên phục vụ",
    joinDate: "",
    status: "Đang làm việc",
    avatar: null,
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "Phục vụ",
        position: "Nhân viên phục vụ",
        joinDate: "",
        status: "Đang làm việc",
        avatar: null,
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {employee ? "Sửa nhân viên" : "Thêm nhân viên"}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên nhân viên
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              placeholder="Nhập tên nhân viên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phòng ban
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              >
                {departments.slice(1).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chức vụ
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
              >
                {positions.slice(1).map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ngày vào làm
              </label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full rounded-[12px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/20"
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
                {statuses.slice(1).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
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

function AdminStaff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    department: "Tất cả",
    position: "Tất cả",
    status: "Tất cả",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    api
      .get("/admin/staff")
      .then((response) => {
        const payload = response.data.data;
        setEmployees(Array.isArray(payload) && payload.length ? payload : sampleEmployees);
      })
      .catch(() => {
        setEmployees(sampleEmployees);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.phone.includes(filters.search);

      const matchesDepartment = filters.department === "Tất cả" || employee.department === filters.department;
      const matchesPosition = filters.position === "Tất cả" || employee.position === filters.position;
      const matchesStatus = filters.status === "Tất cả" || employee.status === filters.status;

      return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
    });
  }, [filters, employees]);

  const stats = useMemo(() => {
    const total = filteredEmployees.length;
    const working = filteredEmployees.filter(emp => emp.status === "Đang làm việc").length;
    const resigned = filteredEmployees.filter(emp => emp.status === "Nghỉ việc").length;
    const probation = filteredEmployees.filter(emp => emp.status === "Thử việc").length;

    return { total, working, resigned, probation };
  }, [filteredEmployees]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      department: "Tất cả",
      position: "Tất cả",
      status: "Tất cả",
    });
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    // TODO: Implement view employee details
    console.log("View employee:", employee);
  };

  const handleDeleteEmployee = (employee) => {
    // TODO: Implement delete employee
    console.log("Delete employee:", employee);
  };

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(prev => prev.map(emp =>
        emp.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : emp
      ));
    } else {
      // Add new employee
      const newEmployee = {
        ...employeeData,
        id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
        <div className="space-y-4 md:space-y-6">
          <HeaderSection onAddEmployee={handleAddEmployee} />
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <StatsCards stats={stats} />

          {loading ? (
            <div className="rounded-[12px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <EmployeeTable
              data={filteredEmployees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onView={handleViewEmployee}
            />
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </AdminLayout>
  );
}

export default AdminStaff;