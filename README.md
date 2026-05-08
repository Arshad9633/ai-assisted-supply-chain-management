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

```text
Supplier → Product → Inventory → Order → Reports → AI Insights
```

This means suppliers provide products, products are stored in inventory, inventory is reduced when orders are placed, reports summarize the system data, and the AI assistant helps users understand the data through simple questions.

---

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

---

## AI Assistant Capabilities

This project includes an AI-assisted chatbot that helps users interact with the supply chain management system through simple business-related questions.

The chatbot currently supports **rule-based business intelligence** using real database records from the backend. It can access supplier, inventory, product, and order data through REST APIs and return meaningful responses based on the available data.

### Supported Questions

Users can ask questions such as:

- Which supplier has highest rating?
- Which supplier has shortest lead time?
- Show low stock products
- Give inventory summary
- Give order summary
- Show pending orders
- Show delayed orders
- What is the top selling product?

### Example Response

```text
The highest-rated supplier is Bosch GmbH.

Country: Germany
Rating: 4.8
Lead time: 7 days
```

### Current Chatbot Functionality

The chatbot can currently help with:

- Finding the highest-rated supplier
- Finding the supplier with the shortest lead time
- Displaying low-stock products
- Showing inventory summaries
- Showing order summaries
- Listing pending orders
- Listing delayed orders
- Identifying top-selling products

### Purpose of the AI Assistant

The main purpose of the chatbot is to make the system easier to use by allowing users to ask business questions in a simple conversational way instead of manually searching through tables and reports.

At the current stage, the chatbot is rule-based and connected to real backend data. This makes the responses reliable and directly related to the stored records in the database.

---

## Project Structure

The project is divided into two main parts:

```text
supply-chain-management-system/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React Vite application
│
└── README.md
```

---

## Backend Responsibilities

The backend handles:

- Supplier APIs
- Product APIs
- Inventory APIs
- Order APIs
- Report APIs
- Chatbot response APIs
- Business logic
- Validation
- MongoDB database communication
- Swagger/OpenAPI documentation

---

## Frontend Responsibilities

The frontend handles:

- User interface pages
- Sidebar navigation
- Dashboard cards
- Charts and reports
- Supplier, product, inventory, and order forms
- API calls using Axios
- Toast notifications
- Chatbot UI
- Responsive layout using CSS

---

## Future Improvements

- JWT authentication and role-based access
- Admin and user dashboards
- OpenAI/Gemini-powered chatbot responses
- Demand forecasting
- Automated reorder recommendations
- Supplier risk scoring
- Warehouse transfer management
- PDF invoice upload and AI document analysis
- Deployment using Docker and cloud hosting

---

## Project Goal

The goal of this project is to create a practical, full-stack supply chain management application that combines traditional business management features with AI-assisted data interaction.

The system demonstrates how modern web technologies and AI-style assistance can be combined to make business data easier to manage, understand, and use.