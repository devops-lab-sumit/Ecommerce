# 15. UML Diagrams & Sequence Diagrams

---

# 15.1 Overview

This chapter describes the interaction between different components of the E-Commerce application using UML diagrams.

These diagrams help developers understand:

- Request flow
- Component interaction
- Service responsibilities
- Communication pattern
- Deployment architecture
- Object relationships

---

# 15.2 Overall System Architecture

```

                    +----------------------+
                    |      React UI        |
                    +----------------------+
                               |
                               |
                               v
                    +----------------------+
                    |      Order API       |
                    +----------------------+
                      /      |      |      \
                     /       |      |       \
                    v        v      v        v
          +-----------+ +-----------+ +-----------+ +----------------+
          | Customer  | | Inventory | | Payment   | | Notification   |
          |    API    | |    API    | |    API    | |      API       |
          +-----------+ +-----------+ +-----------+ +----------------+

```

The Order API acts as the orchestrator and coordinates communication with downstream services.

---

# 15.3 Component Diagram

```

+------------------------------------------------------------+

                    React Frontend

+------------------------------------------------------------+

                        |

                        |

                        v

+------------------------------------------------------------+

                     Order API

-------------------------------------------------------------

OrdersController

↓

OrderService

↓

HttpClients

↓

OrderRepository

+------------------------------------------------------------+

        |            |             |              |

        v            v             v              v

Customer API  Inventory API  Payment API  Notification API

```

---

# 15.4 Layered Architecture

Every microservice follows the same layered architecture.

```

HTTP Request

↓

Controller

↓

Service

↓

Repository

↓

In-Memory Collection

```

Responsibilities

Controller

↓

Receive HTTP Request

↓

Call Service

↓

Return Response

Service

↓

Business Logic

↓

Validation

↓

Repository Calls

Repository

↓

CRUD Operations

↓

Data Storage

---

# 15.5 Order Placement Sequence Diagram

```

User

 |

 | Place Order

 v

React UI

 |

 | POST /api/orders

 v

OrdersController

 |

 v

OrderService

 |

 | GET Customer

 |---------------------------->

 |

 Customer API

 |

 <----------------------------

 Customer Found

 |

 | Reserve Stock

 |---------------------------->

 |

 Inventory API

 |

 <----------------------------

 Stock Reserved

 |

 | Process Payment

 |---------------------------->

 |

 Payment API

 |

 <----------------------------

 Payment Successful

 |

 | Send Notification

 |---------------------------->

 |

 Notification API

 |

 <----------------------------

 Notification Sent

 |

 Save Order

 |

 Return Response

 |

React UI

```

---

# 15.6 Customer Creation Sequence Diagram

```

User

 |

 v

React UI

 |

POST /api/customers

 |

 v

CustomersController

 |

 v

CustomerRepository

 |

Store Customer

 |

Return Created Customer

 |

React UI

```

---

# 15.7 Product Creation Sequence Diagram

```

User

 |

 v

React UI

 |

POST /api/products

 |

 v

ProductsController

 |

 v

ProductRepository

 |

Store Product

 |

Return Product

```

---

# 15.8 Payment Processing Sequence Diagram

```

Order API

 |

POST /api/payments

 |

 v

PaymentsController

 |

 v

PaymentService

 |

Generate Transaction Id

 |

Create Payment

 |

Save Payment

 |

Return Success

```

---

# 15.9 Notification Sequence Diagram

```

Order API

 |

POST /api/notifications

 |

 v

NotificationsController

 |

 v

NotificationService

 |

Simulate Email

 |

Store Notification

 |

Return Success

```

---

# 15.10 Inventory Reservation Sequence Diagram

```

Order API

 |

POST /api/products/reserve

 |

 v

ProductsController

 |

 v

InventoryService

 |

Check Product

 |

Check Quantity

 |

Update Quantity

 |

Return ReserveStockResponse

```

---

# 15.11 Customer API Class Diagram

```

+-------------------------+

CustomersController

-------------------------

+ Get()

+ Get(id)

+ Post()

+ Delete()

+-------------------------+

 |

 |

 v

+-------------------------+

ICustomerRepository

-------------------------

+ GetAll()

+ Get()

+ Add()

+ Delete()

+-------------------------+

 |

 |

 v

+-------------------------+

CustomerRepository

-------------------------

List<Customer>

+-------------------------+

```

---

# 15.12 Inventory API Class Diagram

```

ProductsController

        |

        v

InventoryService

        |

        v

ProductRepository

        |

        v

List<Product>

```

---

# 15.13 Payment API Class Diagram

```

PaymentsController

        |

        v

PaymentService

        |

        v

PaymentRepository

        |

        v

List<Payment>

```

---

# 15.14 Notification API Class Diagram

```

NotificationsController

        |

        v

NotificationService

        |

        v

NotificationRepository

        |

        v

List<Notification>

```

---

# 15.15 Order API Class Diagram

```

OrdersController

        |

        v

OrderService

        |

        |

--------------------------------------------

|           |          |           |

v           v          v           v

Customer  Inventory  Payment  Notification

ApiClient ApiClient ApiClient ApiClient

        |

        v

OrderRepository

        |

        v

List<Order>

```

---

# 15.16 Deployment Diagram (Current)

```

Developer Machine

------------------------------------------------

Windows

VS Code

.NET SDK

 |

 |

 +-------------------------------------------+

 |                                           |

Customer API

Inventory API

Payment API

Notification API

Order API

 |

 |

Browser

Swagger

```

---

# 15.17 Deployment Diagram (Future)

```

                        Internet

                            |

                            v

                        Ingress

                            |

                            v

                    Kubernetes Service

                            |

                +-----------+-----------+

                |                       |

                v                       v

          Order API Pods         Customer Pods

                |

                +-----------+-----------+

                            |

                    Inventory Pods

                    Payment Pods

                    Notification Pods

```

---

# 15.18 Package Diagram

```

Ecommerce

 |

 +-- Customer.Api

 |

 +-- Inventory.Api

 |

 +-- Payment.Api

 |

 +-- Notification.Api

 |

 +-- Order.Api

 |

 +-- Shared.Contracts

 |

 +-- WebUI

```

---

# 15.19 Future Architecture Diagram

```

                React

                  |

                  v

              API Gateway

                  |

      ------------------------------

      |     |      |      |       |

Customer Inventory Payment Order Notification

                  |

                  v

             RabbitMQ

                  |

                  v

             SQL Server

                  |

                  v

             Redis Cache

                  |

                  v

          Prometheus/Grafana

```

---

# 15.20 Diagram Summary

| Diagram | Purpose |
|----------|---------|
| Overall Architecture | High-level system view |
| Component Diagram | Component interaction |
| Layered Architecture | Internal API structure |
| Order Sequence | End-to-end order flow |
| Customer Sequence | Customer creation flow |
| Product Sequence | Product creation flow |
| Inventory Sequence | Stock reservation flow |
| Payment Sequence | Payment processing flow |
| Notification Sequence | Notification flow |
| Customer Class Diagram | Customer API classes |
| Inventory Class Diagram | Inventory API classes |
| Payment Class Diagram | Payment API classes |
| Notification Class Diagram | Notification API classes |
| Order Class Diagram | Order API classes |
| Deployment Diagram | Runtime deployment |
| Package Diagram | Solution organization |
| Future Architecture | Long-term target architecture |
