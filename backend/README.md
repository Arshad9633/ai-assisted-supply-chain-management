# Supply Chain Management Backend

## Overview

This is the backend service for the **AI-Assisted Supply Chain Management System**.

It is built using **Java Spring Boot** and **MongoDB**. The backend provides REST APIs for suppliers, products, inventory, orders, reports-related data, and a business chatbot assistant.

The backend contains the main business logic of the system, including stock validation, inventory deduction, low-stock detection, order status handling, and chatbot-based business insights.

---

## Technology Stack

- Java
- Spring Boot
- MongoDB
- Spring Data MongoDB
- REST APIs
- Swagger / OpenAPI
- Jakarta Validation
- Lombok

---

## Main Modules

## Supplier Module

The Supplier Module manages supplier information.

### Supplier Data

Supplier data includes:

```text
Supplier name
Country
Lead time in days
Rating
```

### Supported Operations

- Create supplier
- View all suppliers
- View supplier by ID
- Update supplier
- Delete supplier

---

## Product Module

The Product Module manages products linked to suppliers.

### Product Data

Product data includes:

```text
Product name
Category
Unit cost
Supplier ID
```

### Supported Operations

- Create product
- View all products
- View product by ID
- Update product
- Delete product

---

## Inventory Module

The Inventory Module manages product stock across warehouses.

### Inventory Data

Inventory data includes:

```text
Product ID
Warehouse ID
Stock level
Reorder threshold
```

### Supported Operations

- Create inventory record
- View all inventory records
- View inventory by ID
- View inventory by product
- View inventory by warehouse
- Update inventory
- Delete inventory
- Get low-stock items

### Low-Stock Logic

An inventory item is considered low stock when:

```text
stockLevel <= reorderThreshold
```

---

## Order Module

The Order Module manages outgoing product orders.

The system supports **multi-product orders**. Each order contains a list of order items, and each order item can have its own warehouse ID.

### Example Order Structure

```json
{
  "items": [
    {
      "productId": "product-id-1",
      "quantity": 5,
      "warehouseId": 1
    },
    {
      "productId": "product-id-2",
      "quantity": 2,
      "warehouseId": 2
    }
  ],
  "orderDate": "2026-05-07",
  "deliveryDate": "2026-05-15",
  "orderStatus": "Pending"
}
```

### Order Business Logic

When an order is created, the backend follows this logic:

1. Check if the product exists
2. Check if inventory exists for the selected product and warehouse
3. Check if the selected warehouse has sufficient stock
4. Reduce inventory stock
5. Save the order

If an order is cancelled or deleted, inventory can be restored.

---

## Chatbot Module

The Chatbot Module provides a backend-powered business assistant.

It receives user questions from the frontend chatbot UI and returns rule-based business intelligence responses using real database records.

### Endpoint

```http
POST /api/chat
```

### Example Request

```json
{
  "message": "Which supplier has highest rating?"
}
```

### Example Response

```json
{
  "reply": "The highest-rated supplier is Bosch GmbH.\n- Country: Germany\n- Rating: 4.8\n- Lead time: 7 days"
}
```

### Supported Chatbot Questions

The chatbot can answer questions about:

- Low stock
- Inventory summary
- Supplier summary
- Highest-rated supplier
- Shortest supplier lead time
- Order summary
- Pending orders
- Delayed orders
- Top-selling products

---

## API Endpoints

## Supplier APIs

```http
POST   /api/suppliers
GET    /api/suppliers
GET    /api/suppliers/{id}
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}
```

## Product APIs

```http
POST   /api/products
GET    /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

## Inventory APIs

```http
POST   /api/inventory
GET    /api/inventory
GET    /api/inventory/{id}
GET    /api/inventory/product/{productId}
GET    /api/inventory/warehouse/{warehouseId}
GET    /api/inventory/low-stock
PUT    /api/inventory/{id}
DELETE /api/inventory/{id}
```

## Order APIs

```http
POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
GET    /api/orders/status/{status}
PATCH  /api/orders/{id}/status
DELETE /api/orders/{id}
```

## Chatbot API

```http
POST /api/chat
```

---

## Project Structure

```text
src/main/java/com/supplychain/backend/
│
├── controller/
│   ├── SupplierController.java
│   ├── ProductController.java
│   ├── InventoryController.java
│   ├── OrderController.java
│   └── ChatController.java
│
├── dto/
│   ├── SupplierRequest.java
│   ├── SupplierResponse.java
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── InventoryRequest.java
│   ├── InventoryResponse.java
│   ├── OrderRequest.java
│   ├── OrderResponse.java
│   ├── ChatRequest.java
│   └── ChatResponse.java
│
├── model/
│   ├── Supplier.java
│   ├── Product.java
│   ├── Inventory.java
│   ├── Order.java
│   └── OrderItem.java
│
├── repository/
│   ├── SupplierRepository.java
│   ├── ProductRepository.java
│   ├── InventoryRepository.java
│   └── OrderRepository.java
│
├── service/
│   ├── SupplierService.java
│   ├── ProductService.java
│   ├── InventoryService.java
│   ├── OrderService.java
│   └── ChatService.java
│
└── exception/
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    └── GlobalExceptionHandler.java
```

---

## Running the Backend

## 1. Start MongoDB

Make sure MongoDB is running locally.

Default MongoDB URL:

```text
mongodb://localhost:27017
```

---

## 2. Configure Application Properties

Add the MongoDB connection and server port inside `application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/supply_chain_db
server.port=8080
```

---

## 3. Run Spring Boot

Using terminal:

```bash
mvn spring-boot:run
```

Or run the main application class from your IDE.

---

## Swagger / OpenAPI

Swagger can be used to test and view backend APIs.

Common Swagger URLs:

```text
http://localhost:8080/swagger-ui.html
```

or:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## Important Business Rules

## Inventory Deduction

When an order is created, stock is reduced from the selected warehouse.

For example, if an order contains 5 units of a product from warehouse 1, then the stock level of that product in warehouse 1 is reduced by 5.

---

## Warehouse-Specific Ordering

Each order item has its own warehouse ID.

This allows a single order to contain products from different warehouses.

Example:

```text
Product A → Warehouse 1
Product B → Warehouse 2
Product C → Warehouse 3
```

---

## Low Stock

An item is considered low stock when:

```text
stockLevel <= reorderThreshold
```

This helps the system identify products that may need restocking.

---

## Order Status

Supported order statuses:

```text
Pending
Shipped
Delivered
Delayed
Cancelled
```

---

## Future Backend Improvements

- JWT authentication
- Role-based authorization
- Admin-only endpoints
- AI model integration with OpenAI or Gemini
- Demand forecasting APIs
- Supplier risk analysis
- Automated purchase order generation
- Docker deployment

---

## Backend Goal

The goal of the backend is to provide a reliable REST API layer for managing the supply chain system.

It handles database communication, validation, business rules, inventory control, order processing, and chatbot-based business insights.