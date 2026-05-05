export default function InventoryList({ inventory, products, onEdit, onDelete }) {
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

  if (inventory.length === 0) {
    return <p className="empty-state">No inventory found.</p>;
  }

  return (
    <div className="supplier-list">
      {inventory.map((item) => {
        const isLowStock = item.stockLevel <= item.reorderThreshold;

        return (
          <div
            key={item.id}
            className="supplier-item"
            style={isLowStock ? { border: "1px solid #dc2626" } : {}}
          >
            <div className="supplier-name">{getProductName(item.productId)}</div>

            <div className="supplier-meta">
              <div><strong>Warehouse ID:</strong> {item.warehouseId}</div>
              <div><strong>Stock Level:</strong> {item.stockLevel}</div>
              <div><strong>Reorder Threshold:</strong> {item.reorderThreshold}</div>
              {isLowStock && (
                <div style={{ color: "#dc2626", fontWeight: "600", marginTop: "0.4rem" }}>
                  Low Stock
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button onClick={() => onEdit(item)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}