import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Menu from "./pages/Menu.jsx";
import Recommendation from "./pages/Recommendation.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CustomerOrders from "./pages/CustomerOrders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Combo from "./pages/Combo.jsx";
import Promotions from "./pages/Promotions.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminRevenue from "./pages/AdminRevenue.jsx";
import AdminPayroll from "./pages/AdminPayroll.jsx";
import AdminStaff from "./pages/AdminStaff.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminSchedule from "./pages/AdminSchedule.jsx";
import DeliveryManagement from "./pages/DeliveryManagement.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import StaffLogin from "./pages/StaffLogin.jsx";
import StaffOrders from "./pages/StaffOrders.jsx";
import StaffRegister from "./pages/StaffRegister.jsx";
import StaffSchedule from "./pages/StaffSchedule.jsx";
import StaffFeedback from "./pages/StaffFeedback.jsx";
import NotFound from "./pages/NotFound.jsx";

function AppContent() {
  const location = useLocation();
  const isAdminOrStaff = location.pathname.startsWith("/admin") || location.pathname.startsWith("/staff");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAdminOrStaff && !isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/register" element={<StaffRegister />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route path="/combo" element={<Combo />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/revenue" element={<AdminRevenue />} />
        <Route path="/admin/payroll" element={<AdminPayroll />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/schedule" element={<AdminSchedule />} />
        <Route path="/admin/delivery" element={<DeliveryManagement />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/orders" element={<StaffOrders />} />
        <Route path="/staff/schedule" element={<StaffSchedule />} />
        <Route path="/staff/feedback" element={<StaffFeedback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
