import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

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
  }, [selectedSupplier]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      supplierName: "",
      country: "",
      leadTimeDays: "",
      rating: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supplierName: formData.supplierName,
      country: formData.country,
      leadTimeDays: Number(formData.leadTimeDays),
      rating: Number(formData.rating),
    };

    try {
      if (selectedSupplier) {
        await api.put(`/suppliers/${selectedSupplier.id}`, payload);
        toast.success(selectedSupplier ? "Supplier updated successfully" : "Supplier added successfully");
      } else {
        await api.post("/suppliers", payload);
        toast.success("Supplier added successfully");
      }

      resetForm();
      clearSelection();
      onSupplierSaved();
    } catch (error) {
      console.error("Error saving supplier:", error);
      const backendMessage =
        error.response?.data?.message || "Failed to save supplier";
      toast.error(backendMessage);
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
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
        />
      </div>

      <div className="form-group">
        <label>Lead Time (Days)</label>
        <input
          type="number"
          name="leadTimeDays"
          value={formData.leadTimeDays}
          onChange={handleChange}
          placeholder="Enter lead time"
        />
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
        />
      </div>

      <div className="button-group">
        <button type="submit">
          {selectedSupplier ? "Update Supplier" : "Add Supplier"}
        </button>

        {selectedSupplier && (
          <button type="button" className="secondary-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}