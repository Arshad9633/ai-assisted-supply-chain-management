import { Routes, Route, NavLink } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import SuppliersPage from "./pages/SuppliersPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Supply Chain System</div>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Dashboard
          </NavLink>

          <NavLink to="/suppliers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Suppliers
          </NavLink>

          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Products
          </NavLink>

          <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Inventory
          </NavLink>

          <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Orders
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}