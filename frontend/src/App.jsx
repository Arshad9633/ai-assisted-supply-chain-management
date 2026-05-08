import { Routes, Route, NavLink } from "react-router";
import {
  LayoutDashboard,
  Truck,
  Package,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Bot
} from "lucide-react";

import DashboardPage from "./pages/DashboardPage";
import SuppliersPage from "./pages/SuppliersPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";
import ChatbotPage from "./pages/ChatbotPage";

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.png" alt="Supply Chain logo" className="brand-image" />
        </div>

        <nav className="menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <Truck size={20} />
            <span>Suppliers</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <Package size={20} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <Warehouse size={20} />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/chatbot"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <Bot size={20} />
            <span>AI Assistant</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-area">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </main>
    </div>
  );
}