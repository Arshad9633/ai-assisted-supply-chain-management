import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";
import ListControls from "../components/ListControls";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 4;

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("product-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      setInventory(res.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const getProductName = (productId) => {
    const product = products.find(
      (p) =>
        p.id === productId ||
        p._id === productId ||
        String(p.id) === String(productId) ||
        String(p._id) === String(productId)
    );

    return product ? product.productName || product.name : "Unknown";
  };

  const filteredAndSortedInventory = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let result = inventory.filter((item) => {
      const productName = getProductName(item.productId);
      const warehouseId = String(item.warehouseId || "");
      const stockLevel = String(item.stockLevel || "");
      const reorderThreshold = String(item.reorderThreshold || "");

      return (
        productName.toLowerCase().includes(term) ||
        warehouseId.includes(term) ||
        stockLevel.includes(term) ||
        reorderThreshold.includes(term)
      );
    });

    result = [...result].sort((a, b) => {
      const productA = getProductName(a.productId);
      const productB = getProductName(b.productId);

      switch (sortOption) {
        case "product-desc":
          return productB.localeCompare(productA);

        case "stock-asc":
          return Number(a.stockLevel || 0) - Number(b.stockLevel || 0);

        case "stock-desc":
          return Number(b.stockLevel || 0) - Number(a.stockLevel || 0);

        case "warehouse-asc":
          return Number(a.warehouseId || 0) - Number(b.warehouseId || 0);

        case "low-stock":
          return (
            Number(a.stockLevel || 0) -
            Number(a.reorderThreshold || 0) -
            (Number(b.stockLevel || 0) - Number(b.reorderThreshold || 0))
          );

        case "product-asc":
        default:
          return productA.localeCompare(productB);
      }
    });

    return result;
  }, [inventory, products, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedInventory.length / ITEMS_PER_PAGE);

  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAndSortedInventory.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedInventory, currentPage]);

  const handleEdit = (item) => {
    setSelectedInventory(item);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`);
      toast.success("Inventory deleted successfully");
      fetchInventory();

      if (selectedInventory && selectedInventory.id === id) {
        setSelectedInventory(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete inventory");
    }
  };

  const clearSelection = () => {
    setSelectedInventory(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Inventory</h1>

      <div className="supplier-layout">
        <div className="card">
          <h2>{selectedInventory ? "Edit Inventory" : "Add Inventory"}</h2>
          <InventoryForm
            products={products}
            selectedInventory={selectedInventory}
            clearSelection={clearSelection}
            onInventorySaved={fetchInventory}
          />
        </div>

        <div className="card">
          <h2>Inventory List</h2>

          <ListControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            placeholder="Search inventory by product, warehouse, stock, or threshold..."
            options={[
              { value: "product-asc", label: "Product A-Z" },
              { value: "product-desc", label: "Product Z-A" },
              { value: "stock-asc", label: "Lowest Stock" },
              { value: "stock-desc", label: "Highest Stock" },
              { value: "warehouse-asc", label: "Warehouse ID" },
              { value: "low-stock", label: "Low Stock First" },
            ]}
          />

          {loading ? (
            <p className="empty-state">Loading inventory...</p>
          ) : (
            <>
              <InventoryList
                inventory={paginatedInventory}
                products={products}
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