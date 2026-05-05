import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import SupplierForm from "../components/SupplierForm";
import SupplierList from "../components/SupplierList";
import ListControls from "../components/ListControls";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 4;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const filteredAndSortedSuppliers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let result = suppliers.filter((supplier) => {
      const name = supplier.supplierName || "";
      const country = supplier.country || "";

      return (
        name.toLowerCase().includes(term) ||
        country.toLowerCase().includes(term)
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "name-desc":
          return (b.supplierName || "").localeCompare(a.supplierName || "");

        case "country-asc":
          return (a.country || "").localeCompare(b.country || "");

        case "rating-desc":
          return Number(b.rating || 0) - Number(a.rating || 0);

        case "leadtime-asc":
          return Number(a.leadTimeDays || 0) - Number(b.leadTimeDays || 0);

        case "name-asc":
        default:
          return (a.supplierName || "").localeCompare(b.supplierName || "");
      }
    });

    return result;
  }, [suppliers, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedSuppliers.length / ITEMS_PER_PAGE);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedSuppliers.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedSuppliers, currentPage]);

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

          <ListControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            placeholder="Search suppliers by name or country..."
          />

          {loading ? (
            <p className="empty-state">Loading suppliers...</p>
          ) : (
            <>
              <SupplierList
                suppliers={paginatedSuppliers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}