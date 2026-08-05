# 13. React Frontend Low-Level Design (LLD)

---

# 13.1 Overview

The frontend application is developed using React and acts as the presentation layer of the E-Commerce Microservices Application.

It communicates with backend microservices through REST APIs.

The frontend does not contain any business logic related to order processing. All business workflows remain in the backend, primarily within the Order API.

The frontend is responsible for:

- Rendering UI
- Calling backend APIs
- Displaying data
- Validating user input
- Showing loading indicators
- Handling API errors
- Navigating between pages

---

# 13.2 Technology Stack

Framework

React 19

Build Tool

Vite

Language

JavaScript

CSS Framework

Bootstrap 5

Routing

React Router DOM

HTTP Client

Axios

Notifications

React Toastify

Icons

React Icons

Package Manager

npm

---

# 13.3 Application Architecture

```

```
                     React Browser

                           │

                           ▼

                      React Router

                           │

        ┌──────────────┼──────────────┐

        ▼              ▼              ▼

 Dashboard      Customers      Products

        │              │              │

        └──────────────┼──────────────┘

                       ▼

                    Orders

                       │

                Axios Service Layer

                       │

         REST APIs (ASP.NET Core)

```

```

---

# 13.4 Folder Structure

```

src

│

├── assets

│

├── components

│     Navbar

│     Sidebar

│     Footer

│     Loader

│     ConfirmDialog

│     PageHeader

│     EmptyState

│

├── layouts

│     MainLayout.jsx

│

├── pages

│     Dashboard

│     Customers

│     Products

│     Orders

│     Payments

│     Notifications

│     PlaceOrder

│

├── services

│     customerService.js

│     inventoryService.js

│     paymentService.js

│     notificationService.js

│     orderService.js

│

├── hooks

│

├── utils

│

├── styles

│

├── App.jsx

└── main.jsx

```

---

# 13.5 Routing

| Route | Page |
|---------|------|
| / | Dashboard |
| /customers | Customers |
| /products | Products |
| /orders | Orders |
| /payments | Payments |
| /notifications | Notifications |
| /place-order | Place Order |

---

# 13.6 Layout

Every page should use

```

MainLayout

```

```
+------------------------------------------------------+

Navbar

+------------------------------------------------------+

Sidebar

|

|

Page Content

|

|

+------------------------------------------------------+

Footer

+------------------------------------------------------+
```

---

# 13.7 Navigation Menu

Dashboard

Customers

Products

Orders

Payments

Notifications

Place Order

---

# 13.8 Component Hierarchy

```
App

↓

BrowserRouter

↓

MainLayout

↓

Navbar

↓

Sidebar

↓

Page

↓

Reusable Components

↓

Axios Service
```

---

# 13.9 Axios Service Layer

Every backend API has its own service.

```
customerService.js

inventoryService.js

paymentService.js

notificationService.js

orderService.js
```

Responsibilities

- HTTP Requests
- Error Handling
- Base URLs
- Response Parsing

UI components should never directly use Axios.

They should only call the Service layer.

---

# 13.10 Backend Mapping

Customer Service

↓

Customer API

```
GET /api/customers

POST /api/customers

DELETE /api/customers/{id}
```

---

Inventory Service

↓

Inventory API

```
GET /api/products

POST /api/products
```

---

Order Service

↓

Order API

```
GET /api/orders

POST /api/orders
```

---

Payment Service

↓

Payment API

```
GET /api/payments
```

---

Notification Service

↓

Notification API

```
GET /api/notifications
```

---

# 13.11 State Management

Current Version

React Hooks

```
useState()

useEffect()
```

No Redux.

No Context API.

Future

React Query

Redux Toolkit

---

# 13.12 Dashboard

Purpose

Application landing page.

Contains

Cards

```
Customers

Products

Orders

Payments

Notifications
```

Each card shows

Count

Button

Navigation

---

# 13.13 Customers Page

Features

- View Customers
- Add Customer
- Delete Customer

Components

Customer Table

Customer Form

Delete Button

Loading Spinner

Toast Message

---

# 13.14 Products Page

Features

View Products

Add Product

Display Inventory

Components

Table

Add Product Modal

Badge

---

# 13.15 Orders Page

Features

Display Orders

View Order Status

Created Date

Amount

Customer

---

# 13.16 Payments Page

Features

Display Payment History

Transaction Id

Amount

Status

---

# 13.17 Notifications Page

Features

Display Notification History

Customer

Email

Subject

Message

Sent Time

---

# 13.18 Place Order Page

This is the primary workflow.

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

Frontend calls

```
POST

/api/orders
```

Displays

Loading Spinner

↓

Success Toast

↓

Order Created

---

# 13.19 Loading States

Every API call should display

Spinner

Loading Message

Disable Submit Button

---

# 13.20 Error Handling

Show

Toast Notification

Friendly Error Message

Retry Button

Common Errors

```
Customer Not Found

Inventory Failed

Payment Failed

Server Error
```

---

# 13.21 Form Validation

Customer

Name Required

Email Required

---

Product

Name Required

Price > 0

Quantity > 0

---

Order

Customer Required

Product Required

Quantity > 0

Amount > 0

---

# 13.22 API Flow

```
React

↓

Axios

↓

Service Layer

↓

Backend API

↓

JSON Response

↓

React State

↓

UI Update
```

---

# 13.23 Responsive Design

Desktop

Tablet

Mobile

Bootstrap Grid

Container

Cards

Responsive Tables

---

# 13.24 Reusable Components

Navbar

Sidebar

Footer

Loader

Button

Card

Table

Modal

Toast

Empty State

Page Header

---

# 13.25 Theme

Professional

Minimal

Bootstrap 5

Blue

White

Gray

Rounded Cards

Soft Shadows

Modern Dashboard

---

# 13.26 Future Enhancements

JWT Login

Dark Mode

Search

Pagination

Sorting

Filtering

Export CSV

Export Excel

SignalR

React Query

Redux Toolkit

Theme Switching

Internationalization (i18n)