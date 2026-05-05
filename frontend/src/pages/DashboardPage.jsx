import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../services/api";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    suppliers: 0,
    products: 0,
    inventory: 0,
    orders: 0,
    lowStock: 0,
  });

  const [inventoryChartData, setInventoryChartData] = useState([]);
  const [ordersStatusData, setOrdersStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductId = (item) => {
    return item.productId || item.product?.id || item.product?._id || "";
  };

  const getProductName = (item, products = []) => {
    if (item.productName) return item.productName;
    if (item.product?.name) return item.product.name;
    if (item.product?.productName) return item.product.productName;
    if (item.name) return item.name;

    const productId = getProductId(item);

    const matchedProduct = products.find(
      (product) =>
        product.id === productId ||
        product._id === productId ||
        String(product.id) === String(productId) ||
        String(product._id) === String(productId)
    );

    return (
      matchedProduct?.name ||
      matchedProduct?.productName ||
      matchedProduct?.title ||
      "Unknown Product"
    );
  };

  const getQuantity = (item) => {
    return item.quantity ?? item.stockQuantity ?? item.availableQuantity ?? 0;
  };

  const getOrderStatus = (order) => {
    return order.status || order.orderStatus || "Pending";
  };

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

      const suppliers = suppliersRes.data || [];
      const products = productsRes.data || [];
      const inventory = inventoryRes.data || [];
      const orders = ordersRes.data || [];
      const lowStock = lowStockRes.data || [];

      setStats({
        suppliers: suppliers.length,
        products: products.length,
        inventory: inventory.length,
        orders: orders.length,
        lowStock: lowStock.length,
      });

      const inventoryData = inventory.map((item) => ({
        name: getProductName(item, products),
        quantity: getQuantity(item),
      }));

      setInventoryChartData(inventoryData);

      const lowStockData = lowStock.map((item) => ({
        ...item,
        displayProductName: getProductName(item, products),
        displayQuantity: getQuantity(item),
      }));

      setLowStockItems(lowStockData.slice(0, 5));

      const statusCount = {};

      orders.forEach((order) => {
        const status = getOrderStatus(order);
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      const orderStatusChart = Object.keys(statusCount).map((status) => ({
        name: status,
        value: statusCount[status],
      }));

      setOrdersStatusData(orderStatusChart);

      const sortedRecentOrders = [...orders]
        .sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt || 0);
          const dateB = new Date(b.orderDate || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 5);

      setRecentOrders(sortedRecentOrders);
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

      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Inventory by Product</h2>

          {inventoryChartData.length === 0 ? (
            <p className="empty-state">No inventory data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>Orders by Status</h2>

          {ordersStatusData.length === 0 ? (
            <p className="empty-state">No order data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {ordersStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#0f766e", "#2563eb", "#f59e0b", "#dc2626"][
                          index % 4
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-card">
          <h2>Low Stock Items</h2>

          {lowStockItems.length === 0 ? (
            <p className="empty-state">No low-stock items.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, index) => (
                  <tr key={item.id || item._id || index}>
                    <td>{item.displayProductName}</td>
                    <td>{item.displayQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="table-card">
          <h2>Recent Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="empty-state">No recent orders.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id || order._id || index}>
                    <td>
                      {order.orderNumber ||
                        order.id ||
                        order._id ||
                        `Order ${index + 1}`}
                    </td>
                    <td>
                      <span className="status-badge">
                        {getOrderStatus(order)}
                      </span>
                    </td>
                    <td>
                      {order.orderDate || order.createdAt
                        ? new Date(
                            order.orderDate || order.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}