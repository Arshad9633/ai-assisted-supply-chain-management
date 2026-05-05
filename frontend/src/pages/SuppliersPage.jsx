import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import SupplierForm from "../components/SupplierForm";
import SupplierList from "../components/SupplierList";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/suppliers/${id}`);
      toast.success("Supplier deleted successfully");
      fetchSuppliers();

      if (selectedSupplier && selectedSupplier.id === id) {
        setSelectedSupplier(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    }
  };

  const clearSelection = () => {
    setSelectedSupplier(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Suppliers</h1>

      <div className="supplier-layout">
        <div className="card">
          <h2>{selectedSupplier ? "Edit Supplier" : "Add Supplier"}</h2>
          <SupplierForm
            onSupplierSaved={fetchSuppliers}
            selectedSupplier={selectedSupplier}
            clearSelection={clearSelection}
          />
        </div>

        <div className="card">
          <h2>Supplier List</h2>

          {loading ? (
            <p className="empty-state">Loading suppliers...</p>
          ) : (
            <SupplierList
              suppliers={suppliers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}