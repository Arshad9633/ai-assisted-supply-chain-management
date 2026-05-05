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
import "./ReportPage.css";

export default function ReportsPage() {
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const [loading, setLoading] = useState(true);

  const getProductName = (item) => {
    if (item.productName) return item.productName;
    if (item.product?.name) return item.product.name;
    if (item.product?.productName) return item.product.productName;
    if (item.name) return item.name;
    return "Unknown Product";
  };

  const getQuantity = (item) => {
    return item.quantity || item.stockQuantity || item.availableQuantity || 0;
  };

  const getOrderStatus = (order) => {
    return order.status || order.orderStatus || "Pending";
  };

  const fetchReportsData = async () => {
    try {
      const [productsRes, inventoryRes, ordersRes, lowStockRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/inventory"),
          api.get("/orders"),
          api.get("/inventory/low-stock"),
        ]);

      const products = productsRes.data || [];
      const inventory = inventoryRes.data || [];
      const orders = ordersRes.data || [];
      const lowStock = lowStockRes.data || [];

      const inventoryChart = inventory.map((item) => ({
        name: getProductName(item),
        quantity: getQuantity(item),
      }));

      setInventoryData(inventoryChart);
      setLowStockItems(lowStock);

      const productChart = products.map((product) => ({
        name: product.name || product.productName || "Unknown Product",
        value: 1,
      }));

      setProductsData(productChart);

      const statusCount = {};

      orders.forEach((order) => {
        const status = getOrderStatus(order);
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      const statusChart = Object.keys(statusCount).map((status) => ({
        name: status,
        value: statusCount[status],
      }));

      setOrdersByStatus(statusChart);

      const sortedOrders = [...orders]
        .sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt || 0);
          const dateB = new Date(b.orderDate || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 10);

      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Reports</h1>
        <p className="empty-state">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="reports-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="reports-subtitle">
            View inventory, product, and order performance reports.
          </p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card large-report-card">
          <h2>Inventory Stock Report</h2>

          {inventoryData.length === 0 ? (
            <p className="empty-state">No inventory data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={inventoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="report-card">
          <h2>Orders by Status</h2>

          {ordersByStatus.length === 0 ? (
            <p className="empty-state">No order data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
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

      <div className="reports-grid">
        <div className="report-card">
          <h2>Product Distribution</h2>

          {productsData.length === 0 ? (
            <p className="empty-state">No product data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {productsData.map((entry, index) => (
                    <Cell
                      key={`product-${index}`}
                      fill={
                        ["#0f766e", "#2563eb", "#7c3aed", "#f97316"][
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

        <div className="report-card">
          <h2>Low Stock Report</h2>

          {lowStockItems.length === 0 ? (
            <p className="empty-state">No low-stock items found.</p>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, index) => (
                  <tr key={item.id || item._id || index}>
                    <td>{getProductName(item)}</td>
                    <td>
                      <span className="danger-value">{getQuantity(item)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="report-card full-width-report">
        <h2>Recent Orders Report</h2>

        {recentOrders.length === 0 ? (
          <p className="empty-state">No recent orders available.</p>
        ) : (
          <table className="reports-table">
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
                    <span className="report-status-badge">
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
  );
}