import { useState, useEffect } from "react";
import api from "../services/api";

export default function InventoryForm({
  products,
  selectedInventory,
  clearSelection,
  onInventorySaved,
}) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    stockLevel: "",
    reorderThreshold: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedInventory) {
      setFormData({
        productId: selectedInventory.productId || "",
        warehouseId: selectedInventory.warehouseId ?? "",
        stockLevel: selectedInventory.stockLevel ?? "",
        reorderThreshold: selectedInventory.reorderThreshold ?? "",
      });
    } else {
      setFormData({
        productId: "",
        warehouseId: "",
        stockLevel: "",
        reorderThreshold: "",
      });
    }
    setErrors({});
  }, [selectedInventory]);

  const validate = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = "Product is required";
    }

    if (formData.warehouseId === "") {
      newErrors.warehouseId = "Warehouse ID is required";
    } else if (Number(formData.warehouseId) < 0) {
      newErrors.warehouseId = "Warehouse ID cannot be negative";
    }

    if (formData.stockLevel === "") {
      newErrors.stockLevel = "Stock level is required";
    } else if (Number(formData.stockLevel) < 0) {
      newErrors.stockLevel = "Stock level cannot be negative";
    }

    if (formData.reorderThreshold === "") {
      newErrors.reorderThreshold = "Reorder threshold is required";
    } else if (Number(formData.reorderThreshold) < 0) {
      newErrors.reorderThreshold = "Reorder threshold cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      productId: formData.productId,
      warehouseId: Number(formData.warehouseId),
      stockLevel: Number(formData.stockLevel),
      reorderThreshold: Number(formData.reorderThreshold),
    };

    try {
      if (selectedInventory) {
        await api.put(`/inventory/${selectedInventory.id}`, payload);
        toast.success(selectedInventory ? "Inventory updated successfully" : "Inventory added successfully");
      } else {
        await api.post("/inventory", payload);
      }

      setFormData({
        productId: "",
        warehouseId: "",
        stockLevel: "",
        reorderThreshold: "",
      });

      setErrors({});
      clearSelection();
      onInventorySaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save inventory");
    }
  };

  const handleCancel = () => {
    clearSelection();
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
        <label>Stock Level</label>
        <input
          type="number"
          name="stockLevel"
          value={formData.stockLevel}
          onChange={handleChange}
          className={errors.stockLevel ? "input-error" : ""}
        />
        {errors.stockLevel && <p className="error-text">{errors.stockLevel}</p>}
      </div>

      <div className="form-group">
        <label>Reorder Threshold</label>
        <input
          type="number"
          name="reorderThreshold"
          value={formData.reorderThreshold}
          onChange={handleChange}
          className={errors.reorderThreshold ? "input-error" : ""}
        />
        {errors.reorderThreshold && (
          <p className="error-text">{errors.reorderThreshold}</p>
        )}
      </div>

      <div className="button-group">
        <button type="submit">
          {selectedInventory ? "Update Inventory" : "Add Inventory"}
        </button>

        {selectedInventory && (
          <button type="button" className="secondary-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}