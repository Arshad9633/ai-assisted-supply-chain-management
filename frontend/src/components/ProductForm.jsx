import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProductForm({
  suppliers,
  selectedProduct,
  clearSelection,
  onProductSaved,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    unitCost: "",
    supplierId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        productName: selectedProduct.productName || "",
        category: selectedProduct.category || "",
        unitCost: selectedProduct.unitCost || "",
        supplierId: selectedProduct.supplierId || "",
      });
    } else {
      setFormData({
        productName: "",
        category: "",
        unitCost: "",
        supplierId: "",
      });
    }
    setErrors({});
  }, [selectedProduct]);

  const validate = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.unitCost === "") {
      newErrors.unitCost = "Unit cost is required";
    } else if (Number(formData.unitCost) < 0) {
      newErrors.unitCost = "Cannot be negative";
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Select a supplier";
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
      productName: formData.productName,
      category: formData.category,
      unitCost: Number(formData.unitCost),
      supplierId: formData.supplierId,
    };

    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, payload);
        toast.success(selectedProduct ? "Product updated successfully" : "Product added successfully");
      } else {
        await api.post("/products", payload);
      }

      setFormData({
        productName: "",
        category: "",
        unitCost: "",
        supplierId: "",
      });

      clearSelection();
      onProductSaved();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleCancel = () => {
    clearSelection();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name</label>
        <input
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className={errors.productName ? "input-error" : ""}
        />
        {errors.productName && <p className="error-text">{errors.productName}</p>}
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? "input-error" : ""}
        />
        {errors.category && <p className="error-text">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label>Unit Cost</label>
        <input
          type="number"
          name="unitCost"
          value={formData.unitCost}
          onChange={handleChange}
          className={errors.unitCost ? "input-error" : ""}
        />
        {errors.unitCost && <p className="error-text">{errors.unitCost}</p>}
      </div>

      <div className="form-group">
        <label>Supplier</label>
        <select
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          className={errors.supplierId ? "input-error" : ""}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.supplierName}
            </option>
          ))}
        </select>
        {errors.supplierId && <p className="error-text">{errors.supplierId}</p>}
      </div>

      <div className="button-group">
        <button type="submit">
          {selectedProduct ? "Update Product" : "Add Product"}
        </button>

        {selectedProduct && (
          <button type="button" className="secondary-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}