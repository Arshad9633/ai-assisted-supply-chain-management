import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function SupplierForm({
  onSupplierSaved,
  selectedSupplier,
  clearSelection,
}) {
  const [formData, setFormData] = useState({
    supplierName: "",
    country: "",
    leadTimeDays: "",
    rating: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedSupplier) {
      setFormData({
        supplierName: selectedSupplier.supplierName || "",
        country: selectedSupplier.country || "",
        leadTimeDays: selectedSupplier.leadTimeDays || "",
        rating: selectedSupplier.rating || "",
      });
    } else {
      setFormData({
        supplierName: "",
        country: "",
        leadTimeDays: "",
        rating: "",
      });
    }
    setErrors({});
  }, [selectedSupplier]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (formData.leadTimeDays === "") {
      newErrors.leadTimeDays = "Lead time is required";
    } else if (Number(formData.leadTimeDays) < 0) {
      newErrors.leadTimeDays = "Lead time cannot be negative";
    }

    if (formData.rating === "") {
      newErrors.rating = "Rating is required";
    } else if (Number(formData.rating) < 0 || Number(formData.rating) > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
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

  const resetForm = () => {
    setFormData({
      supplierName: "",
      country: "",
      leadTimeDays: "",
      rating: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      supplierName: formData.supplierName,
      country: formData.country,
      leadTimeDays: Number(formData.leadTimeDays),
      rating: Number(formData.rating),
    };

    try {
      setIsSaving(true);

      if (selectedSupplier) {
        await api.put(`/suppliers/${selectedSupplier.id}`, payload);
        toast.success("Supplier updated successfully");
      } else {
        await api.post("/suppliers", payload);
        toast.success("Supplier added successfully");
      }

      resetForm();
      clearSelection();
      onSupplierSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save supplier");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    clearSelection();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Supplier Name</label>
        <input
          type="text"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          placeholder="Enter supplier name"
          className={errors.supplierName ? "input-error" : ""}
          disabled={isSaving}
        />
        {errors.supplierName && <p className="error-text">{errors.supplierName}</p>}
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
          className={errors.country ? "input-error" : ""}
          disabled={isSaving}
        />
        {errors.country && <p className="error-text">{errors.country}</p>}
      </div>

      <div className="form-group">
        <label>Lead Time (Days)</label>
        <input
          type="number"
          name="leadTimeDays"
          value={formData.leadTimeDays}
          onChange={handleChange}
          placeholder="Enter lead time"
          className={errors.leadTimeDays ? "input-error" : ""}
          disabled={isSaving}
        />
        {errors.leadTimeDays && <p className="error-text">{errors.leadTimeDays}</p>}
      </div>

      <div className="form-group">
        <label>Rating</label>
        <input
          type="number"
          step="0.1"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Enter rating"
          className={errors.rating ? "input-error" : ""}
          disabled={isSaving}
        />
        {errors.rating && <p className="error-text">{errors.rating}</p>}
      </div>

      <div className="button-group">
        <button type="submit" disabled={isSaving}>
          {isSaving
            ? selectedSupplier
              ? "Updating..."
              : "Saving..."
            : selectedSupplier
            ? "Update Supplier"
            : "Add Supplier"}
        </button>

        {selectedSupplier && (
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}