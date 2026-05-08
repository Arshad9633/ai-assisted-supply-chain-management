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
  const [products, setProducts] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = (result) => {
    return result.status === "fulfilled" ? result.value.data || [] : [];
  };

  const getProductNameById = (productId, productsList = products) => {
    const product = productsList.find(
      (p) =>
        p.id === productId ||
        p._id === productId ||
        String(p.id) === String(productId) ||
        String(p._id) === String(productId)
    );

    return product?.productName || product?.name || "Unknown Product";
  };

  const getInventoryProductName = (item, productsList = products) => {
    if (item.productName) return item.productName;
    if (item.product?.name) return item.product.name;
    if (item.product?.productName) return item.product.productName;
    if (item.name) return item.name;

    return getProductNameById(item.productId, productsList);
  };

  const getInventoryQuantity = (item) => {
    return item.stockLevel ?? item.quantity ?? item.availableQuantity ?? 0;
  };

  const getOrderStatus = (order) => {
    return order.orderStatus || order.status || "Pending";
  };

  const getOrderTotalQuantity = (order) => {
    if (order.totalQuantity !== undefined && order.totalQuantity !== null) {
      return order.totalQuantity;
    }

    if (Array.isArray(order.items)) {
      return order.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );
    }

    return order.quantity || 0;
  };

  const getOrderProductsText = (order) => {
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items
        .map(
          (item) =>
            `${getProductNameById(item.productId)} × ${item.quantity}`
        )
        .join(", ");
    }

    if (order.productId) {
      return `${getProductNameById(order.productId)} × ${order.quantity || 0}`;
    }

    return "No products";
  };

  const fetchReportsData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/products"),
        api.get("/inventory"),
        api.get("/orders"),
        api.get("/inventory/low-stock"),
      ]);

      const productsList = getData(results[0]);
      const inventory = getData(results[1]);
      const orders = getData(results[2]);
      const lowStock = getData(results[3]);

      setProducts(productsList);

      const inventoryChart = inventory.map((item) => ({
        name: getInventoryProductName(item, productsList),
        quantity: getInventoryQuantity(item),
      }));

      setInventoryData(inventoryChart);

      const lowStockData = lowStock.map((item) => ({
        ...item,
        displayProductName: getInventoryProductName(item, productsList),
        displayQuantity: getInventoryQuantity(item),
      }));

      setLowStockItems(lowStockData);

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

      const productStatusMap = {};

      orders.forEach((order) => {
        const status = getOrderStatus(order);

        if (Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const productId = item.productId;

            if (!productStatusMap[productId]) {
              productStatusMap[productId] = {
                productId,
                Delivered: 0,
                Pending: 0,
                Shipped: 0,
                Delayed: 0,
                Cancelled: 0,
              };
            }

            productStatusMap[productId][status] =
              (productStatusMap[productId][status] || 0) +
              Number(item.quantity || 0);
          });
        }
      });

      const productChart = Object.values(productStatusMap).map((entry) => ({
        name: getProductNameById(entry.productId, productsList),
        Delivered: entry.Delivered,
        Pending: entry.Pending,
        Shipped: entry.Shipped,
        Delayed: entry.Delayed,
        Cancelled: entry.Cancelled,
      }));

      setProductsData(productChart);

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
                        ["#0f766e", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed"][
                          index % 5
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
        <div className="report-card large-report-card">
          <h2>Top Selling Products by Status</h2>

          {productsData.length === 0 ? (
            <p className="empty-state">No product order data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={productsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="Delivered" stackId="a" fill="#0f766e" />
                <Bar dataKey="Pending" stackId="a" fill="#2563eb" />
                <Bar dataKey="Shipped" stackId="a" fill="#7c3aed" />
                <Bar dataKey="Delayed" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Cancelled" stackId="a" fill="#dc2626" />
              </BarChart>
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
                    <td>{item.displayProductName}</td>
                    <td>
                      <span className="danger-value">
                        {item.displayQuantity}
                      </span>
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
                <th>Products</th>
                <th>Total Qty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={order.id || order._id || index}>
                  <td>
                    {order.id
                      ? `Order #${order.id.slice(-6)}`
                      : order._id
                      ? `Order #${order._id.slice(-6)}`
                      : `Order ${index + 1}`}
                  </td>

                  <td>{getOrderProductsText(order)}</td>

                  <td>{getOrderTotalQuantity(order)}</td>

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