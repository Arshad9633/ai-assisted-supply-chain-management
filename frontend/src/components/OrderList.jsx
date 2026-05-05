import api from "../services/api";

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
    try {
      await api.delete(`/orders/${id}`);
      onOrderDeleted();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, {
        orderStatus: newStatus,
      });
      onOrderUpdated();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (orders.length === 0) {
    return <p className="empty-state">No orders found.</p>;
  }

  return (
    <div className="supplier-list">
      {orders.map((order) => (
        <div key={order.id} className="supplier-item">
          <div className="supplier-name">{getProductName(order.productId)}</div>

          <div className="supplier-meta">
            <div><strong>Quantity:</strong> {order.quantity}</div>
            <div><strong>Order Date:</strong> {order.orderDate}</div>
            <div><strong>Delivery Date:</strong> {order.deliveryDate || "N/A"}</div>
            <div><strong>Warehouse ID:</strong> {order.warehouseId}</div>
            <div><strong>Status:</strong> {order.orderStatus}</div>
          </div>

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