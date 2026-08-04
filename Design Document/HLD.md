# 5. High-Level Design (HLD)

---

# 5.1 Overview

The E-Commerce Application follows a **Microservices Architecture** where each business capability is implemented as an independent service.

Each microservice:

- Owns its own business logic
- Maintains its own data
- Exposes REST APIs
- Can be deployed independently
- Can scale independently
- Communicates using HTTP

The frontend communicates with the Order API for order placement, while the Order API orchestrates calls to other microservices.

---

# 5.2 System Architecture

```

```
                                +--------------------+
                                |     React UI       |
                                +--------------------+
                                          |
                                          |
                                          |
                                          ▼
                              +-----------------------+
                              |      Order API        |
                              |  (Orchestrator)       |
                              +-----------------------+
                               /      |        |      \
                              /       |        |       \
                             /        |        |        \
                            ▼         ▼        ▼         ▼
                 +-------------+ +-------------+ +-------------+ +----------------+
                 | Customer    | | Inventory   | | Payment     | | Notification   |
                 | API         | | API         | | API         | | API            |
                 +-------------+ +-------------+ +-------------+ +----------------+

```

```

---

# 5.3 Microservices

The system consists of five independent microservices.

| Service | Responsibility |
|----------|----------------|
| Customer API | Customer Management |
| Inventory API | Product & Inventory Management |
| Payment API | Payment Processing |
| Notification API | Notification Management |
| Order API | Order Orchestration |

Additionally,

```

Shared.Contracts

```

contains DTOs shared between services.

---

# 5.4 Service Responsibilities

## Customer API

Responsible for:

- Creating Customers
- Viewing Customers
- Deleting Customers

Owns:

- Customer Repository
- Customer Service
- Customer Controller

---

## Inventory API

Responsible for:

- Product Management
- Inventory Reservation

Owns:

- Product Repository
- Inventory Service
- Products Controller

---

## Payment API

Responsible for:

- Payment Processing
- Payment History

Owns:

- Payment Repository
- Payment Service
- Payments Controller

---

## Notification API

Responsible for:

- Sending Notifications
- Notification History

Owns:

- Notification Repository
- Notification Service
- Notifications Controller

---

## Order API

Responsible for:

- Receiving Order Requests
- Validating Customer
- Reserving Inventory
- Processing Payment
- Sending Notification
- Saving Order

Order API acts as the orchestration layer.

---

# 5.5 Request Flow

The following diagram illustrates the complete order placement workflow.

```

```
User

    |

    ▼

React UI

    |

POST /api/orders

    |

    ▼

Order API

    |

    |------------ GET Customer ------------>

Customer API

    |

    <------------ Customer -----------------

    |

    |------------ Reserve Stock ----------->

Inventory API

    |

    <------------ Success ------------------

    |

    |------------ Process Payment --------->

Payment API

    |

    <------------ Payment Success ----------

    |

    |------------ Send Notification ------->

Notification API

    |

    <------------ Notification Sent --------

    |

Save Order

    |

Return Response

```

```

---

# 5.6 Communication Pattern

Current Version

```

```
REST

↓

HTTP

↓

JSON

↓

Typed HttpClient

```

Order API communicates synchronously with all downstream services.

No asynchronous messaging is implemented.

Future versions may introduce:

- RabbitMQ
- Kafka
- Azure Service Bus

---

# 5.7 Internal Architecture

Every microservice follows the same layered architecture.

```

```
Controller

↓

Service

↓

Repository

↓

In-Memory Collection

```

Responsibilities

### Controller

- Receives HTTP requests
- Performs model binding
- Calls Service
- Returns HTTP response

### Service

- Implements business logic
- Validates business rules
- Coordinates repository operations

### Repository

- Stores data
- Retrieves data
- Updates data
- Deletes data

---

# 5.8 Solution Structure

```

```
Ecommerce

src

│

├── Customer.Api

│

├── Inventory.Api

│

├── Payment.Api

│

├── Notification.Api

│

├── Order.Api

│

├── Shared.Contracts

│

└── WebUI (React)

```

Each API is an independent ASP.NET Core Web API project.

---

# 5.9 Dependency Diagram

```

```
                    Shared.Contracts
                           ▲
                           │
 ┌────────────┬─────────────┼──────────────┬──────────────┐
 │            │             │              │              │
 │            │             │              │              │
 ▼            ▼             ▼              ▼              ▼

Customer   Inventory     Payment     Notification     Order

API         API          API            API            API

```

Only the DTO project is shared.

Repositories and Services are never shared.

---

# 5.10 Service Dependency Matrix

| Service | Depends On |
|----------|------------|
| Customer API | None |
| Inventory API | None |
| Payment API | None |
| Notification API | None |
| Order API | Customer, Inventory, Payment, Notification |

Order API is the only service with downstream dependencies.

---

# 5.11 Technology Stack

Backend

- ASP.NET Core 9
- C#
- Swagger
- REST API
- Dependency Injection
- Typed HttpClient

Frontend

- React
- Vite
- Bootstrap
- Axios
- React Router

Infrastructure

- Docker
- Docker Compose
- Kubernetes
- Helm
- GitHub Actions

---

# 5.12 Design Decisions

## Decision 1

Use Microservices instead of a Monolith.

Reason

To learn cloud-native application architecture.

---

## Decision 2

Use In-Memory Storage.

Reason

Avoid database complexity while learning Kubernetes.

---

## Decision 3

Use REST APIs.

Reason

Simple, widely adopted, and easy to integrate.

---

## Decision 4

Use Typed HttpClient.

Reason

Provides strongly typed service-to-service communication and integrates well with Dependency Injection.

---

## Decision 5

Use Shared.Contracts.

Reason

Avoid duplicating request and response DTOs across microservices.

---

## Decision 6

Order API as Orchestrator.

Reason

Centralizes the business workflow for placing an order while allowing each downstream service to remain focused on a single responsibility.

---

# 5.13 Deployment View

Development

```

React

↓

ASP.NET APIs

↓

Memory

```

Future

```

React

↓

Ingress

↓

Kubernetes Services

↓

Pods

↓

Containers

```

---

# 5.14 Architectural Principles

The solution follows the following principles.

### Single Responsibility Principle

Each microservice owns one business capability.

---

### Loose Coupling

Communication only through REST APIs.

---

### High Cohesion

Business logic remains inside its own service.

---

### Independent Deployment

Every API can be deployed independently.

---

### Independent Scaling

Each API can have a different number of replicas in Kubernetes.

---

### API-First Design

Every interaction between services is exposed through REST endpoints.

---

### Cloud-Native Ready

The application has been structured so it can later support:

- Docker
- Docker Compose
- Kubernetes
- Helm
- Horizontal Pod Autoscaler
- ConfigMaps
- Secrets
- Rolling Updates
- Rolling Rollbacks

without requiring major architectural changes.