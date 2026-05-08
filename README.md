# AI-Assisted Supply Chain Management System

## Overview

This project is a full-stack Supply Chain Management System designed to manage suppliers, products, inventory, orders, reports, and AI-assisted business insights.

The system helps track how products move from suppliers into warehouse inventory and then out through customer or business orders. It also includes an AI-style chatbot assistant that can answer supply chain questions using real backend data.

The project is built as a modern business application using Spring Boot, MongoDB, React, Vite, REST APIs, charts, dashboard analytics, and a chatbot interface.

---

## Main Features

### Supplier Management
- Add, update, delete, and view suppliers
- Store supplier country, lead time, and rating
- Identify best-rated suppliers
- Analyze supplier performance through the chatbot

### Product Management
- Add, update, delete, and view products
- Link products to suppliers
- Track product category and unit cost

### Inventory Management
- Add and update warehouse inventory
- Track stock level and reorder threshold
- Detect low-stock products
- Reduce stock automatically when orders are placed

### Order Management
- Create multi-product orders
- Each product line can have its own warehouse ID
- Track order status such as Pending, Shipped, Delivered, Delayed, and Cancelled
- Automatically reduce inventory when an order is created
- Restore inventory when an order is cancelled or deleted

### Reports and Dashboard
- Dashboard summary cards
- Inventory stock charts
- Orders by status chart
- Top-selling products by status
- Low-stock report
- Recent orders report

### AI Supply Chain Assistant
- Chatbot interface integrated into the frontend
- Backend-powered business responses
- Answers questions using live database data
- Supports questions about suppliers, inventory, products, orders, and low stock

---

## Business Logic

The system follows this supply chain flow:

```txt
Supplier → Product → Inventory → Order → Reports → AI Insights

## Technology Stack

### Backend

The backend of this project is built using Java and Spring Boot. It provides REST APIs for managing suppliers, products, inventory, orders, reports, and chatbot-related data access.

**Technologies used:**

- Java
- Spring Boot
- MongoDB
- Spring Data MongoDB
- REST APIs
- Swagger / OpenAPI
- Jakarta Validation
- Lombok

### Frontend

The frontend is developed using React with Vite. It provides a responsive user interface for managing the supply chain system, viewing reports, and interacting with the AI-assisted chatbot.

**Technologies used:**

- React
- Vite
- Axios
- React Router
- React Hot Toast
- Recharts
- Lucide React Icons
- CSS-based responsive UI