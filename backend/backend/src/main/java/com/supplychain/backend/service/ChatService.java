package com.supplychain.backend.service;

import com.supplychain.backend.dto.ChatResponse;
import com.supplychain.backend.model.Inventory;
import com.supplychain.backend.model.Order;
import com.supplychain.backend.model.OrderItem;
import com.supplychain.backend.model.Product;
import com.supplychain.backend.model.Supplier;
import com.supplychain.backend.repository.InventoryRepository;
import com.supplychain.backend.repository.OrderRepository;
import com.supplychain.backend.repository.ProductRepository;
import com.supplychain.backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    public ChatService(SupplierRepository supplierRepository,
                       ProductRepository productRepository,
                       InventoryRepository inventoryRepository,
                       OrderRepository orderRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
    }

    public ChatResponse getReply(String message) {
        if (message == null || message.trim().isEmpty()) {
            return new ChatResponse("Please ask a supply chain question.");
        }

        String query = message.toLowerCase();

        if (containsAny(query, "highest rating", "best supplier", "top supplier", "highest rated supplier")) {
            return getHighestRatedSupplier();
        }

        if (containsAny(query, "lowest rating", "worst supplier", "low rated supplier")) {
            return getLowestRatedSupplier();
        }

        if (containsAny(query, "fastest supplier", "lowest lead time", "shortest lead time", "quickest supplier")) {
            return getFastestSupplier();
        }

        if (containsAny(query, "slowest supplier", "highest lead time", "longest lead time")) {
            return getSlowestSupplier();
        }

        if (containsAny(query, "low stock", "reorder", "restock", "almost out", "out of stock", "need attention")) {
            return getLowStockReply();
        }

        if (containsAny(query, "inventory summary", "stock summary", "inventory status", "stock status")) {
            return getInventorySummary();
        }

        if (containsAny(query, "supplier summary", "supplier report", "suppliers summary")) {
            return getSupplierSummary();
        }

        if (containsAny(query, "product summary", "product report", "products summary")) {
            return getProductSummary();
        }

        if (containsAny(query, "order summary", "order report", "orders summary")) {
            return getOrderSummary();
        }

        if (containsAny(query, "pending order", "pending orders")) {
            return getOrdersByStatusReply("Pending");
        }

        if (containsAny(query, "delayed order", "delayed orders")) {
            return getOrdersByStatusReply("Delayed");
        }

        if (containsAny(query, "shipped order", "shipped orders")) {
            return getOrdersByStatusReply("Shipped");
        }

        if (containsAny(query, "delivered order", "delivered orders")) {
            return getOrdersByStatusReply("Delivered");
        }

        if (containsAny(query, "cancelled order", "cancelled orders", "canceled order", "canceled orders")) {
            return getOrdersByStatusReply("Cancelled");
        }

        if (containsAny(query, "top selling", "most ordered", "best selling", "highest demand")) {
            return getTopSellingProduct();
        }

        if (containsAny(query, "total stock", "how much stock", "stock units")) {
            return getInventorySummary();
        }

        return new ChatResponse(
                "I can answer questions such as:\n"
                        + "- Which supplier has highest rating?\n"
                        + "- Which supplier has shortest lead time?\n"
                        + "- Show low stock products\n"
                        + "- Show pending orders\n"
                        + "- Show delayed orders\n"
                        + "- Give inventory summary\n"
                        + "- Give order summary\n"
                        + "- What is the top selling product?"
        );
    }

    private boolean containsAny(String query, String... keywords) {
        for (String keyword : keywords) {
            if (query.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private ChatResponse getHighestRatedSupplier() {
        List<Supplier> suppliers = supplierRepository.findAll();

        if (suppliers.isEmpty()) {
            return new ChatResponse("No suppliers are currently registered.");
        }

        Optional<Supplier> bestSupplier = suppliers.stream()
                .filter(s -> s.getRating() != null)
                .max(Comparator.comparingDouble(Supplier::getRating));

        if (bestSupplier.isEmpty()) {
            return new ChatResponse("Supplier ratings are not available.");
        }

        Supplier supplier = bestSupplier.get();

        return new ChatResponse(
                "The highest-rated supplier is " + supplier.getSupplierName() + ".\n"
                        + "- Country: " + supplier.getCountry() + "\n"
                        + "- Rating: " + supplier.getRating() + "\n"
                        + "- Lead time: " + supplier.getLeadTimeDays() + " days"
        );
    }

    private ChatResponse getLowestRatedSupplier() {
        List<Supplier> suppliers = supplierRepository.findAll();

        if (suppliers.isEmpty()) {
            return new ChatResponse("No suppliers are currently registered.");
        }

        Optional<Supplier> supplierResult = suppliers.stream()
                .filter(s -> s.getRating() != null)
                .min(Comparator.comparingDouble(Supplier::getRating));

        if (supplierResult.isEmpty()) {
            return new ChatResponse("Supplier ratings are not available.");
        }

        Supplier supplier = supplierResult.get();

        return new ChatResponse(
                "The lowest-rated supplier is " + supplier.getSupplierName() + ".\n"
                        + "- Country: " + supplier.getCountry() + "\n"
                        + "- Rating: " + supplier.getRating() + "\n"
                        + "- Lead time: " + supplier.getLeadTimeDays() + " days"
        );
    }

    private ChatResponse getFastestSupplier() {
        List<Supplier> suppliers = supplierRepository.findAll();

        if (suppliers.isEmpty()) {
            return new ChatResponse("No suppliers are currently registered.");
        }

        Optional<Supplier> supplierResult = suppliers.stream()
                .filter(s -> s.getLeadTimeDays() != null)
                .min(Comparator.comparingInt(Supplier::getLeadTimeDays));

        if (supplierResult.isEmpty()) {
            return new ChatResponse("Supplier lead time data is not available.");
        }

        Supplier supplier = supplierResult.get();

        return new ChatResponse(
                "The supplier with the shortest lead time is " + supplier.getSupplierName() + ".\n"
                        + "- Country: " + supplier.getCountry() + "\n"
                        + "- Lead time: " + supplier.getLeadTimeDays() + " days\n"
                        + "- Rating: " + supplier.getRating()
        );
    }

    private ChatResponse getSlowestSupplier() {
        List<Supplier> suppliers = supplierRepository.findAll();

        if (suppliers.isEmpty()) {
            return new ChatResponse("No suppliers are currently registered.");
        }

        Optional<Supplier> supplierResult = suppliers.stream()
                .filter(s -> s.getLeadTimeDays() != null)
                .max(Comparator.comparingInt(Supplier::getLeadTimeDays));

        if (supplierResult.isEmpty()) {
            return new ChatResponse("Supplier lead time data is not available.");
        }

        Supplier supplier = supplierResult.get();

        return new ChatResponse(
                "The supplier with the longest lead time is " + supplier.getSupplierName() + ".\n"
                        + "- Country: " + supplier.getCountry() + "\n"
                        + "- Lead time: " + supplier.getLeadTimeDays() + " days\n"
                        + "- Rating: " + supplier.getRating()
        );
    }

    private ChatResponse getLowStockReply() {
        List<Inventory> inventoryList = inventoryRepository.findAll();

        List<Inventory> lowStockItems = inventoryList.stream()
                .filter(item -> item.getStockLevel() != null
                        && item.getReorderThreshold() != null
                        && item.getStockLevel() <= item.getReorderThreshold())
                .toList();

        if (lowStockItems.isEmpty()) {
            return new ChatResponse("There are currently no low-stock products.");
        }

        StringBuilder reply = new StringBuilder("Low-stock products:\n");

        for (Inventory item : lowStockItems) {
            String productName = getProductName(item.getProductId());

            reply.append("- ")
                    .append(productName)
                    .append(" | Warehouse ID: ")
                    .append(item.getWarehouseId())
                    .append(" | Stock: ")
                    .append(item.getStockLevel())
                    .append(" | Reorder threshold: ")
                    .append(item.getReorderThreshold())
                    .append("\n");
        }

        return new ChatResponse(reply.toString());
    }

    private ChatResponse getInventorySummary() {
        List<Inventory> inventoryList = inventoryRepository.findAll();

        int totalRecords = inventoryList.size();

        int totalStock = inventoryList.stream()
                .mapToInt(item -> item.getStockLevel() == null ? 0 : item.getStockLevel())
                .sum();

        long lowStockCount = inventoryList.stream()
                .filter(item -> item.getStockLevel() != null
                        && item.getReorderThreshold() != null
                        && item.getStockLevel() <= item.getReorderThreshold())
                .count();

        return new ChatResponse(
                "Inventory summary:\n"
                        + "- Total inventory records: " + totalRecords + "\n"
                        + "- Total stock units: " + totalStock + "\n"
                        + "- Low-stock items: " + lowStockCount
        );
    }

    private ChatResponse getSupplierSummary() {
        List<Supplier> suppliers = supplierRepository.findAll();

        if (suppliers.isEmpty()) {
            return new ChatResponse("No suppliers are currently registered.");
        }

        double averageRating = suppliers.stream()
                .filter(s -> s.getRating() != null)
                .mapToDouble(Supplier::getRating)
                .average()
                .orElse(0);

        double averageLeadTime = suppliers.stream()
                .filter(s -> s.getLeadTimeDays() != null)
                .mapToInt(Supplier::getLeadTimeDays)
                .average()
                .orElse(0);

        return new ChatResponse(
                "Supplier summary:\n"
                        + "- Total suppliers: " + suppliers.size() + "\n"
                        + "- Average supplier rating: " + String.format("%.2f", averageRating) + "\n"
                        + "- Average lead time: " + String.format("%.1f", averageLeadTime) + " days"
        );
    }

    private ChatResponse getProductSummary() {
        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            return new ChatResponse("No products are currently registered.");
        }

        return new ChatResponse(
                "Product summary:\n"
                        + "- Total products: " + products.size()
        );
    }

    private ChatResponse getOrderSummary() {
        List<Order> orders = orderRepository.findAll();

        long pending = orders.stream().filter(o -> "Pending".equalsIgnoreCase(o.getOrderStatus())).count();
        long shipped = orders.stream().filter(o -> "Shipped".equalsIgnoreCase(o.getOrderStatus())).count();
        long delivered = orders.stream().filter(o -> "Delivered".equalsIgnoreCase(o.getOrderStatus())).count();
        long delayed = orders.stream().filter(o -> "Delayed".equalsIgnoreCase(o.getOrderStatus())).count();
        long cancelled = orders.stream().filter(o -> "Cancelled".equalsIgnoreCase(o.getOrderStatus())).count();

        return new ChatResponse(
                "Order summary:\n"
                        + "- Total orders: " + orders.size() + "\n"
                        + "- Pending: " + pending + "\n"
                        + "- Shipped: " + shipped + "\n"
                        + "- Delivered: " + delivered + "\n"
                        + "- Delayed: " + delayed + "\n"
                        + "- Cancelled: " + cancelled
        );
    }

    private ChatResponse getOrdersByStatusReply(String status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);

        if (orders.isEmpty()) {
            return new ChatResponse("There are no " + status.toLowerCase() + " orders.");
        }

        StringBuilder reply = new StringBuilder(status + " orders:\n");

        for (Order order : orders) {
            reply.append("- Order #")
                    .append(shortId(order.getId()))
                    .append(" | Date: ")
                    .append(order.getOrderDate())
                    .append(" | Total quantity: ")
                    .append(getTotalQuantity(order))
                    .append("\n");
        }

        return new ChatResponse(reply.toString());
    }

    private ChatResponse getTopSellingProduct() {
        List<Order> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            return new ChatResponse("There are no orders available to calculate top-selling products.");
        }

        List<Product> products = productRepository.findAll();

        String topProductId = null;
        int topQuantity = 0;

        for (Order order : orders) {
            if (order.getItems() == null) continue;

            for (OrderItem item : order.getItems()) {
                if (item.getProductId() == null || item.getQuantity() == null) continue;

                int totalForProduct = orders.stream()
                        .filter(o -> o.getItems() != null)
                        .flatMap(o -> o.getItems().stream())
                        .filter(i -> item.getProductId().equals(i.getProductId()))
                        .mapToInt(i -> i.getQuantity() == null ? 0 : i.getQuantity())
                        .sum();

                if (totalForProduct > topQuantity) {
                    topQuantity = totalForProduct;
                    topProductId = item.getProductId();
                }
            }
        }

        if (topProductId == null) {
            return new ChatResponse("No product quantities are available in orders.");
        }

        String productName = "Unknown Product";

        for (Product product : products) {
            if (product.getId().equals(topProductId)) {
                productName = product.getProductName();
                break;
            }
        }

        return new ChatResponse(
                "The top-selling product is " + productName + ".\n"
                        + "- Total ordered quantity: " + topQuantity
        );
    }

    private String getProductName(String productId) {
        return productRepository.findById(productId)
                .map(Product::getProductName)
                .orElse("Unknown Product");
    }

    private int getTotalQuantity(Order order) {
        if (order.getItems() == null) {
            return 0;
        }

        return order.getItems()
                .stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();
    }

    private String shortId(String id) {
        if (id == null || id.length() < 6) {
            return id;
        }

        return id.substring(id.length() - 6);
    }
}