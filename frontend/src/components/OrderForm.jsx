import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function OrderForm({ products, onOrderSaved }) {
  const [items, setItems] = useState([
    {
      productId: "",
      quantity: "",
      warehouseId: "",
    },
  ]);

  const [formData, setFormData] = useState({
    orderDate: "",
    deliveryDate: "",
    orderStatus: "Pending",
  });

  const [errors, setErrors] = useState({});

  const getProductName = (productId) => {
    const product = products.find(
      (p) =>
        p.id === productId ||
        p._id === productId ||
        String(p.id) === String(productId) ||
        String(p._id) === String(productId)
    );

    return product ? product.productName || product.name : "Product";
  };

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const addItem = () => {
    setItems([...items, { productId: "", quantity: "", warehouseId: "" }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      toast.error("At least one product is required");
      return;
    }

    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    setErrors((prev) => ({
      ...prev,
      [`items-${index}-${field}`]: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    items.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`items-${index}-productId`] = "Product is required";
      }

      if (item.quantity === "") {
        newErrors[`items-${index}-quantity`] = "Quantity is required";
      } else if (Number(item.quantity) <= 0) {
        newErrors[`items-${index}-quantity`] =
          "Quantity must be greater than 0";
      }

      if (item.warehouseId === "") {
        newErrors[`items-${index}-warehouseId`] = "Warehouse ID is required";
      } else if (Number(item.warehouseId) < 0) {
        newErrors[`items-${index}-warehouseId`] =
          "Warehouse ID cannot be negative";
      }
    });

    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required";
    }

    if (!formData.orderStatus) {
      newErrors.orderStatus = "Order status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setItems([{ productId: "", quantity: "", warehouseId: "" }]);

    setFormData({
      orderDate: "",
      deliveryDate: "",
      orderStatus: "Pending",
    });

    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        warehouseId: Number(item.warehouseId),
      })),
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate || null,
      orderStatus: formData.orderStatus,
    };

    try {
      await api.post("/orders", payload);

      resetForm();
      toast.success("Order created successfully");
      onOrderSaved();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Failed to create order";

      toast.error(backendMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="order-section-title">Products in this order</div>

      {items.map((item, index) => (
        <div key={index} className="order-item-box">
          <div className="order-item-header">
            <span>Item {index + 1}</span>

            <button
              type="button"
              className="remove-item-btn"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>

          <div className="form-group">
            <label>Product</label>
            <select
              value={item.productId}
              onChange={(e) =>
                handleItemChange(index, "productId", e.target.value)
              }
              className={
                errors[`items-${index}-productId`] ? "input-error" : ""
              }
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.productName || p.name}
                </option>
              ))}
            </select>

            {errors[`items-${index}-productId`] && (
              <p className="error-text">
                {errors[`items-${index}-productId`]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className={errors[`items-${index}-quantity`] ? "input-error" : ""}
            />

            {errors[`items-${index}-quantity`] && (
              <p className="error-text">
                {errors[`items-${index}-quantity`]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Warehouse ID</label>
            <input
              type="number"
              value={item.warehouseId}
              onChange={(e) =>
                handleItemChange(index, "warehouseId", e.target.value)
              }
              className={
                errors[`items-${index}-warehouseId`] ? "input-error" : ""
              }
            />

            {errors[`items-${index}-warehouseId`] && (
              <p className="error-text">
                {errors[`items-${index}-warehouseId`]}
              </p>
            )}
          </div>
        </div>
      ))}

      <button type="button" className="add-item-btn" onClick={addItem}>
        + Add another product
      </button>

      <div className="order-summary-box">
        <p>
          <strong>Total product lines:</strong> {items.length}
        </p>
        <p>
          <strong>Total quantity:</strong> {totalQuantity}
        </p>
        <p>
          <strong>Selected:</strong>{" "}
          {items
            .filter((item) => item.productId)
            .map((item) => getProductName(item.productId))
            .join(", ") || "No products selected"}
        </p>
      </div>

      <div className="form-group">
        <label>Order Date</label>
        <input
          type="date"
          name="orderDate"
          value={formData.orderDate}
          onChange={handleChange}
          className={errors.orderDate ? "input-error" : ""}
        />
        {errors.orderDate && <p className="error-text">{errors.orderDate}</p>}
      </div>

      <div className="form-group">
        <label>Expected Delivery Date</label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="orderStatus"
          value={formData.orderStatus}
          onChange={handleChange}
          className={errors.orderStatus ? "input-error" : ""}
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Delayed">Delayed</option>
        </select>

        {errors.orderStatus && (
          <p className="error-text">{errors.orderStatus}</p>
        )}
      </div>

      <button type="submit" className="create-order-btn">
        Create Order
      </button>
    </form>
  );
}