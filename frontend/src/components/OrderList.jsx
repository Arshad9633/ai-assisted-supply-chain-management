import api from "../services/api";
import toast from "react-hot-toast";

export default function OrderList({
  orders,
  products,
  onOrderUpdated,
  onOrderDeleted,
}) {
  const getProductName = (id) => {
    const p = products.find(
      (x) =>
        x.id === id ||
        x._id === id ||
        String(x.id) === String(id) ||
        String(x._id) === String(id)
    );

    return p ? p.productName || p.name : "Unknown";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${id}`);
      toast.success("Order deleted successfully");
      onOrderDeleted();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, {
        orderStatus: newStatus,
      });

      toast.success("Order status updated");
      onOrderUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (orders.length === 0) {
    return <p className="empty-state">No orders found.</p>;
  }

  return (
    <div className="supplier-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-card-title">
            Order #{order.id?.slice(-6) || "New"}
          </div>

          <div className="supplier-meta">
            <div>
              <strong>Total Quantity:</strong> {order.totalQuantity}
            </div>
            <div>
              <strong>Order Date:</strong> {order.orderDate}
            </div>
            <div>
              <strong>Delivery Date:</strong> {order.deliveryDate || "N/A"}
            </div>
            <div>
              <strong>Status:</strong> {order.orderStatus}
            </div>
          </div>

          <ul className="order-products-list">
            {order.items?.length > 0 ? (
              order.items.map((item, index) => (
                <li key={index}>
                  {getProductName(item.productId)} × {item.quantity} | Warehouse ID:{" "}
                  {item.warehouseId || "N/A"}
                </li>
              ))
            ) : (
              <li>No order items found</li>
            )}
          </ul>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Update Status</label>
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="action-buttons">
            <button className="delete-btn" onClick={() => handleDelete(order.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}