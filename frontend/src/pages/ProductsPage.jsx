import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import ListControls from "../components/ListControls";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 4;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      toast.error("Failed to load suppliers");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(
      (s) =>
        s.id === supplierId ||
        s._id === supplierId ||
        String(s.id) === String(supplierId) ||
        String(s._id) === String(supplierId)
    );

    return supplier ? supplier.supplierName : "";
  };

  const filteredAndSortedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let result = products.filter((product) => {
      const productName = product.productName || "";
      const category = product.category || "";
      const supplierName = getSupplierName(product.supplierId);
      const unitCost = String(product.unitCost || "");

      return (
        productName.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term) ||
        supplierName.toLowerCase().includes(term) ||
        unitCost.includes(term)
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "name-desc":
          return (b.productName || "").localeCompare(a.productName || "");

        case "category-asc":
          return (a.category || "").localeCompare(b.category || "");

        case "cost-asc":
          return Number(a.unitCost || 0) - Number(b.unitCost || 0);

        case "cost-desc":
          return Number(b.unitCost || 0) - Number(a.unitCost || 0);

        case "name-asc":
        default:
          return (a.productName || "").localeCompare(b.productName || "");
      }
    });

    return result;
  }, [products, suppliers, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();

      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const clearSelection = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Products</h1>

      <div className="supplier-layout">
        <div className="card">
          <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>
          <ProductForm
            suppliers={suppliers}
            selectedProduct={selectedProduct}
            clearSelection={clearSelection}
            onProductSaved={fetchProducts}
          />
        </div>

        <div className="card">
          <h2>Product List</h2>

          <ListControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            placeholder="Search products by name, category, supplier, or cost..."
            options={[
              { value: "name-asc", label: "Name A-Z" },
              { value: "name-desc", label: "Name Z-A" },
              { value: "category-asc", label: "Category A-Z" },
              { value: "cost-asc", label: "Lowest Cost" },
              { value: "cost-desc", label: "Highest Cost" },
            ]}
          />

          {loading ? (
            <p className="empty-state">Loading products...</p>
          ) : (
            <>
              <ProductList
                products={paginatedProducts}
                suppliers={suppliers}
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