This is a great idea. Starting a fresh chat for the React frontend will keep things clean.

Below is a **comprehensive project summary** that you can paste as the first prompt in the new chat. It explains the current backend, architecture, endpoints, and what the frontend should build.

---

# E-Commerce Microservices Backend Summary

## Objective

I have built a backend for a learning project whose primary goal is learning:

* React
* Docker
* Docker Compose
* Kubernetes
* Helm
* GitHub Actions
* Microservices communication

The backend is intentionally simple and uses **in-memory collections instead of a database**.

I do **not** want to redesign the backend. Build the frontend according to the existing backend.

---

# Technology Stack

Backend

* .NET 9 Web API
* ASP.NET Core
* Swagger
* In-Memory Repository
* Dependency Injection
* Typed HttpClient
* Shared Contracts Project

Frontend (to build)

* React
* Vite
* React Router
* Axios
* Bootstrap 5

---

# Solution Structure

```text
Ecommerce

src
│
├── Customer.Api
├── Inventory.Api
├── Payment.Api
├── Notification.Api
├── Order.Api
│
└── Shared.Contracts

Ecommerce.sln
```

---

# Architecture

```text
                React UI
                    │
                    ▼
               Order API
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
Customer API  Inventory API  Payment API
                                   │
                                   ▼
                          Notification API
```

Order API acts as the **orchestrator**.

---

# Shared.Contracts

There is a class library named

```text
Shared.Contracts
```

It contains DTOs shared between services.

Examples

```text
CustomerDto

ReserveStockRequest
ReserveStockResponse

PaymentRequest
PaymentResponse

NotificationRequest
NotificationResponse
```

---

# Customer API

Runs on

```text
http://localhost:5001
```

Swagger

```text
http://localhost:5001/swagger
```

Endpoints

### GET

```http
/api/customers
```

Returns all customers.

---

### GET

```http
/api/customers/{id}
```

Returns a customer.

---

### POST

```http
/api/customers
```

Body

```json
{
  "name":"John",
  "email":"john@test.com"
}
```

Creates customer.

---

### DELETE

```http
/api/customers/{id}
```

Deletes customer.

---

Customer is stored in-memory.

---

# Inventory API

Runs on

```text
http://localhost:5002
```

Swagger

```text
http://localhost:5002/swagger
```

Endpoints

### GET

```http
/api/products
```

Returns products.

---

### GET

```http
/api/products/{id}
```

Returns product.

---

### POST

```http
/api/products
```

Body

```json
{
  "name":"iPhone",
  "price":90000,
  "quantity":20
}
```

Creates product.

---

### POST

```http
/api/products/reserve
```

Body

```json
{
  "productId":1,
  "quantity":2
}
```

Returns

```json
{
  "success":true,
  "message":"Stock Reserved",
  "remainingStock":18
}
```

Inventory is stored in-memory.

---

# Payment API

Runs on

```text
http://localhost:5003
```

Swagger

```text
http://localhost:5003/swagger
```

Endpoints

### POST

```http
/api/payments
```

Body

```json
{
  "orderId":1,
  "amount":180000
}
```

Returns

```json
{
  "success":true,
  "transactionId":"guid",
  "message":"Payment Successful"
}
```

---

### GET

```http
/api/payments
```

Returns all payments.

Payments are stored in-memory.

---

# Notification API

Runs on

```text
http://localhost:5004
```

Swagger

```text
http://localhost:5004/swagger
```

Endpoints

### POST

```http
/api/notifications
```

Body

```json
{
  "customerName":"John",
  "email":"john@test.com",
  "subject":"Order Created",
  "message":"Your order has been placed successfully."
}
```

Returns

```json
{
  "success":true,
  "status":"Notification Sent"
}
```

---

### GET

```http
/api/notifications
```

Returns all notifications.

Notifications are stored in-memory.

---

# Order API

Runs on

```text
http://localhost:5005
```

Swagger

```text
http://localhost:5005/swagger
```

Endpoints

### GET

```http
/api/orders
```

Returns all orders.

---

### GET

```http
/api/orders/{id}
```

Returns one order.

---

### POST

```http
/api/orders
```

Body

```json
{
  "customerId":1,
  "productId":1,
  "quantity":2,
  "amount":180000
}
```

Internally performs

```
1. Call Customer API

↓

2. Call Inventory API

↓

3. Call Payment API

↓

4. Call Notification API

↓

5. Save Order

↓

Return Response
```

Order is stored in-memory.

---

# HttpClient Configuration

Order API contains typed HttpClients.

```text
CustomerApiClient

InventoryApiClient

PaymentApiClient

NotificationApiClient
```

Each is registered using

```csharp
builder.Services.AddHttpClient(...)
```

Base URLs are configured using appsettings.

Example

```json
{
  "Services": {
    "CustomerApi":"http://localhost:5001",
    "InventoryApi":"http://localhost:5002",
    "PaymentApi":"http://localhost:5003",
    "NotificationApi":"http://localhost:5004"
  }
}
```

---

# Backend Workflow

```
React

↓

POST /api/orders

↓

Order API

↓

Customer API

↓

Inventory API

↓

Payment API

↓

Notification API

↓

Order Saved

↓

React receives success
```

---

# Data Storage

Everything is stored in static in-memory lists.

There is

* No SQL Server
* No MongoDB
* No Entity Framework
* No Cosmos DB

This is intentional.

---

# What the Frontend Should Build

Create a modern React application.

Use

* React
* Vite
* Bootstrap 5
* Axios
* React Router

---

# UI Pages

## Home

Dashboard showing navigation cards.

---

## Customers

Display all customers.

Allow

* View
* Add
* Delete

---

## Products

Display all products.

Allow

* View
* Add

---

## Place Order

User selects

Customer

↓

Product

↓

Quantity

↓

Amount

↓

Click

```
Place Order
```

Call

```
POST /api/orders
```

Show

* Loading spinner
* Success message
* Error message

---

## Orders

Display all orders.

---

## Payments

Display all payments.

---

## Notifications

Display all notifications.

---

# UI Requirements

Use

Bootstrap 5

Responsive

Navbar

Cards

Tables

Forms

Toast Notifications

Loading Spinner

Proper Validation

Modern colors

Professional layout

---

# Axios

Create a folder

```
src/services
```

Example

```
customerService.js

inventoryService.js

paymentService.js

notificationService.js

orderService.js
```

Use Axios.

---

# React Structure

```
src

components

pages

services

hooks

layouts

assets

App.jsx

main.jsx
```

---

# Important Notes

* Do **not** modify the backend APIs.
* Do **not** change endpoint URLs.
* Do **not** redesign the backend architecture.
* Consume the APIs exactly as implemented.
* The frontend should be clean, modular, and production-style, but the backend should remain unchanged.

---

# Future Phases (Do Not Implement Yet)

After the React frontend is complete, the plan is:

1. Create Dockerfiles for:

   * Customer.Api
   * Inventory.Api
   * Payment.Api
   * Notification.Api
   * Order.Api
   * React UI

2. Create `docker-compose.yml`.

3. Deploy to Kubernetes using:

   * Deployments
   * Services
   * Ingress
   * ConfigMaps
   * Secrets

4. Create Helm charts.

5. Add GitHub Actions CI/CD.

6. Add health checks, logging, and observability.

The React implementation should keep these future deployment steps in mind but should not implement them yet.
