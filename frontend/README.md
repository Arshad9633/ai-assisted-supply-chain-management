# Supply Chain Management Frontend

## Overview

This is the React frontend for the **AI-Assisted Supply Chain Management System**.

The frontend provides a clean business dashboard for managing suppliers, products, inventory, orders, reports, and an AI-style chatbot assistant.

It communicates with the Spring Boot backend using Axios and displays business data using modern UI components, charts, cards, tables, search, sorting, pagination, and toast notifications.

---

## Technology Stack

- React
- Vite
- Axios
- React Router
- React Hot Toast
- Recharts
- Lucide React Icons
- CSS

---

## Main Pages

## Dashboard Page

The Dashboard Page displays key business metrics and visual summaries.

### Dashboard Features

```text
Total suppliers
Total products
Total inventory records
Total orders
Low-stock items
Inventory chart
Orders by status chart
Recent orders
Low-stock table
```

---

## Suppliers Page

The Suppliers Page allows users to manage supplier records.

### Features

- Add supplier
- Edit supplier
- Delete supplier
- Search suppliers
- Sort suppliers
- Pagination

---

## Products Page

The Products Page allows users to manage products linked to suppliers.

### Features

- Add product
- Edit product
- Delete product
- Link product to supplier
- Search products
- Sort products
- Pagination

---

## Inventory Page

The Inventory Page allows users to manage warehouse stock.

### Features

- Add inventory record
- Edit inventory record
- Delete inventory record
- View product stock
- View warehouse ID
- Low-stock highlighting
- Search inventory
- Sort inventory
- Pagination

---

## Orders Page

The Orders Page allows users to create and manage multi-product orders.

### Features

- Create orders with multiple products
- Each product item has its own warehouse ID
- Update order status
- Delete orders
- View total order quantity
- Search orders
- Sort orders
- Pagination

### Example Order Display

```text
Order #A1B2C3

Steel Bolt Premium × 2 | Warehouse ID: 1
Volkswagen Engine × 1 | Warehouse ID: 2

Status: Pending
```

---

## Reports Page

The Reports Page displays business reports and visual analytics.

### Reports Included

- Inventory Stock Report
- Orders by Status
- Top Selling Products by Status
- Low Stock Report
- Recent Orders Report

---

## AI Assistant Page

The AI Assistant Page provides a chatbot interface for supply chain questions.

Users can ask questions such as:

- Which supplier has highest rating?
- Which supplier has shortest lead time?
- Show low stock products
- Give inventory summary
- Give order summary
- Show delayed orders
- What is the top selling product?

The chatbot calls the backend endpoint:

```http
POST /api/chat
```

---

## Project Structure

```text
src/
│
├── components/
│   ├── SupplierForm.jsx
│   ├── SupplierList.jsx
│   ├── ProductForm.jsx
│   ├── ProductList.jsx
│   ├── InventoryForm.jsx
│   ├── InventoryList.jsx
│   ├── OrderForm.jsx
│   ├── OrderList.jsx
│   ├── ListControls.jsx
│   └── Pagination.jsx
│
├── pages/
│   ├── DashboardPage.jsx
│   ├── DashboardPage.css
│   ├── SuppliersPage.jsx
│   ├── ProductsPage.jsx
│   ├── InventoryPage.jsx
│   ├── OrdersPage.jsx
│   ├── OrdersPage.css
│   ├── ReportsPage.jsx
│   ├── ReportPage.css
│   ├── ChatbotPage.jsx
│   └── ChatbotPage.css
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Axios Configuration

The frontend uses Axios for backend communication.

Example `api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;
```

---

## Running the Frontend

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Start Development Server

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Required Backend

Make sure the Spring Boot backend is running on:

```text
http://localhost:8080
```

The frontend expects backend APIs under:

```text
http://localhost:8080/api
```

---

## Sidebar Navigation

The frontend includes a fixed vertical sidebar with routes for:

- Dashboard
- Suppliers
- Products
- Inventory
- Orders
- Reports
- AI Assistant

---

## UI Features

- Fixed sidebar layout
- Responsive page content
- Toast notifications
- Search bars
- Sorting dropdowns
- Pagination with four records per page
- Business charts using Recharts
- Clean card-based UI
- Floating-style chatbot interface

---

## Chatbot UI

The chatbot is designed as a business assistant interface.

It includes:

- Bot logo
- Message bubbles
- User and bot messages
- Typing indicator
- Message input
- Send button
- Business-style responses

To use a custom bot logo, place the image inside the `public` folder:

```text
public/bot-logo.png
```

Then use:

```jsx
<img src="/bot-logo.png" alt="Bot" />
```

---

## Future Frontend Improvements

- Login and signup pages
- Protected routes
- Admin panel
- User roles
- Export reports as PDF or Excel
- Dark mode
- Real-time notifications
- AI-powered reorder recommendations
- Forecasting dashboard
- Deployment build with Docker or Nginx

---

## Frontend Goal

The goal of the frontend is to provide a clean, responsive, and user-friendly interface for managing supply chain data.

It allows users to perform CRUD operations, view reports, analyze charts, and interact with the AI-assisted chatbot through a simple business dashboard.