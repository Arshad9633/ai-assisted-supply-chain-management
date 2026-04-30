import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function OrderForm({ products, onOrderSaved }) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    orderDate: "",
    deliveryDate: "",
    warehouseId: "",
    orderStatus: "Pending",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = "Product is required";
    }

    if (formData.quantity === "") {
      newErrors.quantity = "Quantity is required";
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required";
    }

    if (formData.warehouseId === "") {
      newErrors.warehouseId = "Warehouse ID is required";
    } else if (Number(formData.warehouseId) < 0) {
      newErrors.warehouseId = "Warehouse ID cannot be negative";
    }

    if (!formData.orderStatus) {
      newErrors.orderStatus = "Order status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      productId: formData.productId,
      quantity: Number(formData.quantity),
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate || null,
      warehouseId: Number(formData.warehouseId),
      orderStatus: formData.orderStatus,
    };

    try {
      await api.post("/orders", payload);

      setFormData({
        productId: "",
        quantity: "",
        orderDate: "",
        deliveryDate: "",
        warehouseId: "",
        orderStatus: "Pending",
      });

      setErrors({});
      toast.success("Order created successfully");
      onOrderSaved();
    } catch (err) {
      console.error("Error creating order:", err);

      const backendMessage =
        err.response?.data?.message || "Failed to create order";

      toast.error(backendMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className={errors.productId ? "input-error" : ""}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.productName}
            </option>
          ))}
        </select>
        {errors.productId && <p className="error-text">{errors.productId}</p>}
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className={errors.quantity ? "input-error" : ""}
        />
        {errors.quantity && <p className="error-text">{errors.quantity}</p>}
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
        <label>Delivery Date</label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Warehouse ID</label>
        <input
          type="number"
          name="warehouseId"
          value={formData.warehouseId}
          onChange={handleChange}
          className={errors.warehouseId ? "input-error" : ""}
        />
        {errors.warehouseId && <p className="error-text">{errors.warehouseId}</p>}
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
        {errors.orderStatus && <p className="error-text">{errors.orderStatus}</p>}
      </div>

      <button type="submit">Create Order</button>
    </form>
  );
}