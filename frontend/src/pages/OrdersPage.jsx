import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";
import ListControls from "../components/ListControls";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 4;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
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
    fetchOrders();
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

  const filteredAndSortedOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let result = orders.filter((order) => {
      const productName = getProductName(order.productId);
      const status = order.orderStatus || "";
      const warehouseId = String(order.warehouseId || "");
      const quantity = String(order.quantity || "");
      const orderDate = order.orderDate || "";
      const deliveryDate = order.deliveryDate || "";

      return (
        productName.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term) ||
        warehouseId.includes(term) ||
        quantity.includes(term) ||
        orderDate.includes(term) ||
        deliveryDate.includes(term)
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return new Date(a.orderDate || 0) - new Date(b.orderDate || 0);

        case "product-asc":
          return getProductName(a.productId).localeCompare(
            getProductName(b.productId)
          );

        case "product-desc":
          return getProductName(b.productId).localeCompare(
            getProductName(a.productId)
          );

        case "quantity-asc":
          return Number(a.quantity || 0) - Number(b.quantity || 0);

        case "quantity-desc":
          return Number(b.quantity || 0) - Number(a.quantity || 0);

        case "status-asc":
          return (a.orderStatus || "").localeCompare(b.orderStatus || "");

        case "date-desc":
        default:
          return new Date(b.orderDate || 0) - new Date(a.orderDate || 0);
      }
    });

    return result;
  }, [orders, products, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAndSortedOrders.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedOrders, currentPage]);

  return (
    <div className="page-container">
      <h1 className="page-title">Orders</h1>

      <div className="supplier-layout">
        <div className="card">
          <h2>Create Order</h2>
          <OrderForm products={products} onOrderSaved={fetchOrders} />
        </div>

        <div className="card">
          <h2>Order List</h2>

          <ListControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            placeholder="Search orders by product, status, date, warehouse, or quantity..."
            options={[
              { value: "date-desc", label: "Newest First" },
              { value: "date-asc", label: "Oldest First" },
              { value: "product-asc", label: "Product A-Z" },
              { value: "product-desc", label: "Product Z-A" },
              { value: "quantity-asc", label: "Lowest Quantity" },
              { value: "quantity-desc", label: "Highest Quantity" },
              { value: "status-asc", label: "Status A-Z" },
            ]}
          />

          {loading ? (
            <p className="empty-state">Loading orders...</p>
          ) : (
            <>
              <OrderList
                orders={paginatedOrders}
                products={products}
                onOrderUpdated={fetchOrders}
                onOrderDeleted={fetchOrders}
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