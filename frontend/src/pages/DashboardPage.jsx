import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    suppliers: 0,
    products: 0,
    inventory: 0,
    orders: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [suppliersRes, productsRes, inventoryRes, ordersRes, lowStockRes] =
        await Promise.all([
          api.get("/suppliers"),
          api.get("/products"),
          api.get("/inventory"),
          api.get("/orders"),
          api.get("/inventory/low-stock"),
        ]);

      setStats({
        suppliers: suppliersRes.data.length,
        products: productsRes.data.length,
        inventory: inventoryRes.data.length,
        orders: ordersRes.data.length,
        lowStock: lowStockRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <p className="empty-state">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Suppliers</h3>
          <p>{stats.suppliers}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Inventory Records</h3>
          <p>{stats.inventory}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div className="dashboard-card low-stock-card">
          <h3>Low Stock Items</h3>
          <p>{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
}