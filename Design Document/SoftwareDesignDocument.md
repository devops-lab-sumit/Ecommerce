# Proposed Document Structure

```
Software Design Document (SDD)

1. Document Information
2. Project Overview
3. Functional Requirements
4. Non-Functional Requirements
5. High Level Architecture
6. Solution Structure
7. Shared.Contracts
8. Customer API
9. Inventory API
10. Payment API
11. Notification API
12. Order API
13. Service-to-Service Communication
14. Complete API Specifications
15. React UI Requirements
16. Docker Design
17. Kubernetes Design
18. Future Enhancements
```

---



# Software Design Document

## Document Information

````markdown
# 1. Software Design Document (SDD)

## Project

E-Commerce Microservices Application

---

## Version

1.0

---

## Document Status

Draft

---

## Author

Sumit Raj

---

## Purpose

The purpose of this document is to describe the complete software design of the E-Commerce Microservices Application.

This document acts as the Low-Level Design (LLD) and implementation guide for backend, frontend, Docker, Kubernetes, and future enhancements.

A frontend developer should be able to build the React application using only this document without reading the backend source code.

---

## Intended Audience

- Backend Developers
- Frontend Developers
- DevOps Engineers
- QA Engineers
- Technical Architects

---

## Technology Stack

### Backend

- ASP.NET Core 9 Web API
- C#
- Swagger
- REST APIs
- In-Memory Repository
- Dependency Injection
- Typed HttpClient

### Frontend

- React
- Vite
- Bootstrap 5
- Axios
- React Router

### DevOps

- Docker
- Docker Compose
- Kubernetes
- Helm
- GitHub Actions

---

## Repository Structure

```
Ecommerce

src
│
├── Customer.Api
├── Inventory.Api
├── Payment.Api
├── Notification.Api
├── Order.Api
│
├── Shared.Contracts
│
└── WebUI (React - To be developed)

docker

k8s

helm

scripts

README.md

Ecommerce.sln
```

---

## Project Goal

Develop a simple E-Commerce application using a Microservices Architecture.

The project is primarily intended for learning and demonstrating:

- Microservices
- ASP.NET Core
- React
- Docker
- Kubernetes
- Helm
- CI/CD

The backend intentionally uses an in-memory repository to avoid database complexity during infrastructure learning.

---

## Current Scope

Current implementation includes:

- Customer Service
- Inventory Service
- Payment Service
- Notification Service
- Order Service
- Shared Contracts

Database integration is intentionally postponed.

---

## Out of Scope

The following features are intentionally excluded from Version 1.0:

- Authentication
- Authorization
- SQL Server
- Entity Framework
- Redis
- RabbitMQ
- Kafka
- JWT
- Identity Server
- Event Bus
- Distributed Transactions
- Polly
- Monitoring
- Metrics
- Health Checks

These features will be implemented in future versions after the Kubernetes deployment is complete.

---

## Assumptions

- All services communicate over HTTP.
- All services are independently deployable.
- Data is stored in memory.
- Swagger is enabled for every API.
- React will consume only the REST APIs.
- Docker and Kubernetes deployment will happen after frontend development.

---

## Revision History

| Version | Date | Author | Description |
|----------|------|--------|-------------|
| 1.0 | TBD | Sumit Raj | Initial Version |
````

---

# 2. Project Overview

---

# 2.1 Introduction

The E-Commerce Microservices Application is a distributed system developed for learning modern software engineering and cloud-native application development.

The application demonstrates how multiple independently deployable microservices collaborate to complete a business transaction.

Although the application implements a simple e-commerce workflow, the architecture closely resembles enterprise applications where services are loosely coupled and communicate over REST APIs.

The backend is intentionally designed using in-memory repositories instead of a database so that the focus remains on:

- Microservices
- API communication
- React integration
- Docker
- Kubernetes
- Helm
- CI/CD

Once the infrastructure is complete, the in-memory repositories can be replaced with SQL Server or any other database.

---

# 2.2 Business Problem

An online shopping application needs to support the following operations:

- Manage Customers
- Manage Products
- Manage Inventory
- Process Payments
- Send Notifications
- Create Orders

Instead of building everything inside one monolithic application, the system is divided into multiple microservices where each service owns a single business capability.

---

# 2.3 Project Objectives

The primary objectives of this project are:

### Functional Objectives

- Create Customers
- Create Products
- Reserve Product Inventory
- Process Payments
- Send Notifications
- Place Orders

### Technical Objectives

- Learn ASP.NET Core Microservices
- Learn REST API Communication
- Learn Typed HttpClient
- Learn Dependency Injection
- Learn React Integration
- Learn Docker
- Learn Kubernetes
- Learn Helm
- Learn GitHub Actions

---

# 2.4 Application Scope

The current version includes the following microservices:

| Service | Responsibility |
|----------|---------------|
| Customer API | Customer Management |
| Inventory API | Product & Inventory Management |
| Payment API | Payment Processing |
| Notification API | Notification Management |
| Order API | Order Orchestration |
| Shared.Contracts | Common DTOs |

The application does not currently include:

- Authentication
- Authorization
- Database
- Distributed Transactions
- Event Bus
- Message Queue

These features will be implemented in future versions.

---

# 2.5 Microservice Responsibilities

## Customer API

Responsible for customer management.

Responsibilities

- Create Customer
- View Customer
- View All Customers
- Delete Customer

Customer API is the source of truth for customer information.

---

## Inventory API

Responsible for product inventory.

Responsibilities

- Create Product
- View Product
- View Products
- Reserve Stock

Inventory API owns product quantity.

---

## Payment API

Responsible for payment processing.

Responsibilities

- Process Payment
- View Payments

Payment API stores payment history.

---

## Notification API

Responsible for notifications.

Responsibilities

- Send Notification
- View Notification History

Current implementation simulates sending an email.

---

## Order API

Order API is the orchestrator.

Responsibilities

- Receive Order Request
- Validate Customer
- Reserve Inventory
- Process Payment
- Send Notification
- Save Order

Order API coordinates all business operations.

---

# 2.6 High-Level Architecture

```
                        React UI
                            │
                            │
                            ▼
                    +----------------+
                    |    Order API   |
                    +----------------+
                     │      │      │
                     │      │      │
                     ▼      ▼      ▼
          +-----------+  +-----------+  +-----------+
          | Customer  |  | Inventory |  | Payment   |
          |   API     |  |    API    |  |    API    |
          +-----------+  +-----------+  +-----------+
                                    │
                                    ▼
                           +------------------+
                           | Notification API |
                           +------------------+
```

---

# 2.7 Complete Order Workflow

When a customer places an order from the React application, the following sequence occurs.

```
React UI

↓

POST /api/orders

↓

Order API

↓

Validate Customer

↓

Reserve Product Inventory

↓

Process Payment

↓

Send Notification

↓

Save Order

↓

Return Success Response
```

The Order API is the only service exposed to the frontend for order placement.

All other service calls happen internally.

---

# 2.8 Component Interaction

```
User

↓

React UI

↓

REST API

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
```

Each service is independently deployable.

Each service maintains its own business logic.

---

# 2.9 Communication Pattern

The application currently uses synchronous communication.

```
Order API

↓

HTTP Request

↓

Customer API

↓

HTTP Response

↓

Inventory API

↓

HTTP Response

↓

Payment API

↓

HTTP Response

↓

Notification API

↓

HTTP Response
```

Communication is implemented using ASP.NET Core Typed HttpClient.

No asynchronous messaging is used in Version 1.

---

# 2.10 Design Principles

The application follows the following principles.

### Single Responsibility

Each microservice owns one business capability.

Example

Customer API does not process payments.

Payment API does not reserve inventory.

---

### Loose Coupling

Services communicate only through HTTP APIs.

No service directly accesses another service's repository.

---

### High Cohesion

Business logic remains inside the owning service.

---

### Independent Deployment

Each microservice can be deployed independently.

---

### API First Design

Every interaction between services occurs through REST endpoints.

---

# 2.11 Current Limitations

Current implementation intentionally keeps the architecture simple.

Known limitations include:

- In-memory data
- No persistence
- No authentication
- No authorization
- No caching
- No retry mechanism
- No circuit breaker
- No health checks
- No monitoring
- No message broker

These limitations are acceptable because the primary goal is infrastructure learning.

---

# 2.12 Future Roadmap

Future enhancements include:

Version 2

- SQL Server
- Entity Framework Core

Version 3

- JWT Authentication
- Role Based Authorization

Version 4

- Docker
- Docker Compose

Version 5

- Kubernetes
- Ingress
- ConfigMap
- Secrets
- HPA

Version 6

- Helm Charts

Version 7

- GitHub Actions CI/CD

Version 8

- Redis
- RabbitMQ
- Polly
- Prometheus
- Grafana
- OpenTelemetry


# 3. Functional Requirements

---

# 3.1 Introduction

This section describes all business functionalities implemented in the current version of the E-Commerce Microservices Application.

Each requirement includes:

- Requirement ID
- Requirement Name
- Description
- Actor
- Preconditions
- Main Flow
- Alternate Flow
- Postconditions
- Business Rules

---

# FR-001

## Customer Management

### Description

The system shall allow users to manage customers.

### Primary Actor

User

### Preconditions

- Customer API is running.
- Swagger or React UI is available.

### Main Flow

1. User opens Customer page.
2. User enters customer information.
3. User clicks Create Customer.
4. Customer API validates the request.
5. Customer Repository stores the customer in memory.
6. Customer API returns created customer.

### Alternate Flow

If customer information is invalid

↓

Return HTTP 400

### Postconditions

Customer is available in memory.

### Business Rules

- Customer Name is mandatory.
- Email is mandatory.
- Customer Id is auto-generated.

---

# FR-002

## View Customers

### Description

The system shall display all customers.

### Actor

User

### Main Flow

1. User opens Customers page.
2. React calls

GET /api/customers

3. Customer API returns customer list.
4. UI displays customers.

### Postconditions

Customer list is displayed.

---

# FR-003

## Delete Customer

### Description

Delete an existing customer.

### Main Flow

1. User clicks Delete.
2. React calls

DELETE /api/customers/{id}

3. Repository removes customer.
4. HTTP 204 returned.

### Business Rules

Customer must exist.

---

# FR-004

## Product Management

### Description

System shall manage products.

### Features

- Add Product
- View Product
- View Products

### Actor

User

### Preconditions

Inventory API running.

### Main Flow

User

↓

POST

/api/products

↓

Inventory Repository

↓

Product Stored

---

# FR-005

## View Products

### Description

Return all products.

### Main Flow

React

↓

GET

/api/products

↓

Inventory API

↓

Products Returned

---

# FR-006

## Reserve Product Inventory

### Description

Reserve stock before payment.

### Primary Actor

Order API

### Secondary Actor

Inventory API

### Preconditions

Product exists.

### Main Flow

Order API sends

POST

/api/products/reserve

↓

Inventory API checks

Current Quantity

↓

Enough Stock?

↓

Yes

↓

Decrease Quantity

↓

Return Success

### Alternate Flow

Insufficient Stock

↓

Return

Success = false

### Business Rules

Inventory cannot become negative.

---

# FR-007

## Payment Processing

### Description

Process customer payment.

### Primary Actor

Order API

### Preconditions

Inventory reservation successful.

### Main Flow

Order API

↓

POST

/api/payments

↓

Payment Service

↓

Payment Stored

↓

Return Success

### Alternate Flow

Payment Failure

↓

Return Failure

### Business Rules

Current implementation always succeeds.

---

# FR-008

## Send Notification

### Description

Send order confirmation.

### Primary Actor

Order API

### Main Flow

Order API

↓

POST

/api/notifications

↓

Notification Service

↓

Notification Repository

↓

Return Success

Current implementation simulates email delivery.

---

# FR-009

## Place Order

### Description

Place an order.

### Primary Actor

User

### Secondary Actor

Order API

### Preconditions

Customer exists.

Product exists.

Stock available.

### Main Flow

User

↓

React UI

↓

POST

/api/orders

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

Save Order

↓

Return Success

### Alternate Flow

Customer not found

↓

Return Failure

---

Inventory reservation failed

↓

Return Failure

---

Payment failed

↓

Return Failure

### Postconditions

Order stored in memory.

Payment stored.

Notification stored.

Inventory updated.

---

# FR-010

## View Orders

### Description

Return all orders.

### Main Flow

React

↓

GET

/api/orders

↓

Order API

↓

Repository

↓

Return Orders

---

# FR-011

## View Payments

### Description

Display payment history.

### Main Flow

React

↓

GET

/api/payments

↓

Payment Repository

↓

Return Payments

---

# FR-012

## View Notifications

### Description

Display notification history.

### Main Flow

React

↓

GET

/api/notifications

↓

Notification Repository

↓

Return Notifications

---

# Functional Requirement Matrix

| ID | Feature | API |
|----|----------|-----|
| FR-001 | Create Customer | Customer API |
| FR-002 | View Customers | Customer API |
| FR-003 | Delete Customer | Customer API |
| FR-004 | Create Product | Inventory API |
| FR-005 | View Products | Inventory API |
| FR-006 | Reserve Stock | Inventory API |
| FR-007 | Process Payment | Payment API |
| FR-008 | Send Notification | Notification API |
| FR-009 | Place Order | Order API |
| FR-010 | View Orders | Order API |
| FR-011 | View Payments | Payment API |
| FR-012 | View Notifications | Notification API |

---

# Current Functional Coverage

Current Version Implements

✔ Customer Management

✔ Product Management

✔ Inventory Reservation

✔ Payment Processing

✔ Notification Sending

✔ Order Placement

✔ Order Orchestration

✔ REST APIs

✔ Swagger

✔ Shared Contracts

✔ Typed HttpClient

Future versions will add

- Authentication
- Authorization
- SQL Server
- Docker
- Kubernetes
- Helm
- Monitoring
- Distributed Tracing
- Health Checks

# 4. Non-Functional Requirements (NFR)

---

# 4.1 Introduction

Non-functional requirements describe the quality attributes of the system rather than the business functionality.

These requirements ensure that the application is scalable, maintainable, reliable, secure, and suitable for future cloud-native deployment.

The current implementation intentionally keeps some requirements simple because the project is designed for learning Docker, Kubernetes, and Microservices.

---

# NFR-001 Performance

## Objective

The system should respond quickly to client requests.

## Requirements

- Average API response time should be less than 500 ms for CRUD operations.
- Order placement should complete within 2 seconds.
- Swagger UI should load within 3 seconds.
- The application should support multiple concurrent users without failure.

## Current Implementation

- In-memory repository
- No database
- No network latency except service-to-service HTTP calls

Future

- SQL Server
- Redis
- Connection Pooling

---

# NFR-002 Scalability

## Objective

Every microservice should scale independently.

Current Design

```
Customer API

Inventory API

Payment API

Notification API

Order API
```

Future Kubernetes deployment

```
Customer API
Replicas = 3

Inventory API
Replicas = 2

Payment API
Replicas = 4

Notification API
Replicas = 2

Order API
Replicas = 5
```

Benefits

- Independent scaling
- Better resource utilization
- Fault isolation

---

# NFR-003 Availability

## Objective

Services should remain available even if another service is unavailable.

Current Version

No retry mechanism.

Future

- Health Checks
- Kubernetes Restart Policy
- Liveness Probe
- Readiness Probe
- Circuit Breaker
- Retry Policy

Expected Availability

99.9%

---

# NFR-004 Reliability

The application should continue operating correctly under expected workloads.

Current

- In-memory data
- Manual restart required after crash

Future

- SQL Server persistence
- Automatic Kubernetes pod restart
- Multiple replicas

---

# NFR-005 Maintainability

The project should be easy to maintain.

Current Design

```
Controller

↓

Service

↓

Repository

↓

Memory
```

Advantages

- Separation of concerns
- Small classes
- Dependency Injection
- Easy testing

---

# NFR-006 Modularity

Each microservice owns one business capability.

Customer API

↓

Customer only

Inventory API

↓

Inventory only

Payment API

↓

Payment only

Notification API

↓

Notifications only

Order API

↓

Order orchestration only

No service accesses another service's repository directly.

---

# NFR-007 Loose Coupling

Microservices communicate only through REST APIs.

```
Order API

↓

HTTP

↓

Customer API
```

No shared database.

No direct repository access.

Communication uses Typed HttpClient.

---

# NFR-008 High Cohesion

Each service contains only related business logic.

Example

Customer API

✔ Customer Repository

✔ Customer Service

✔ Customer Controller

No payment logic.

---

# NFR-009 Security

Current Version

No authentication.

No authorization.

Future

JWT Authentication

↓

Role Based Authorization

↓

HTTPS Only

↓

API Gateway

↓

OAuth2

---

# NFR-010 Logging

Every API should produce meaningful logs.

Examples

Customer API

```
Customer Created

Customer Deleted

Customer Retrieved
```

Inventory API

```
Product Added

Inventory Reserved

Inventory Updated
```

Payment API

```
Payment Started

Payment Successful

Payment Failed
```

Notification API

```
Notification Sent

Notification Failed
```

Order API

```
Order Request Received

Customer Validated

Inventory Reserved

Payment Completed

Notification Sent

Order Saved
```

Future

Serilog

ElasticSearch

Kibana

---

# NFR-011 Monitoring

Current

Console Logging

Future

Prometheus

Grafana

OpenTelemetry

Distributed Tracing

Application Insights

---

# NFR-012 Configuration

Configuration should not be hardcoded.

Current

appsettings.json

```
Services

CustomerApi

InventoryApi

PaymentApi

NotificationApi
```

Future

Environment Variables

↓

ConfigMap

↓

Secrets

---

# NFR-013 Port Configuration

Current

| Service | Port |
|----------|------|
| Customer API | 5001 |
| Inventory API | 5002 |
| Payment API | 5003 |
| Notification API | 5004 |
| Order API | 5005 |

Future

Kubernetes Services

```
customer-api

inventory-api

payment-api

notification-api

order-api
```

---

# NFR-014 Deployment

Current

```
dotnet run
```

Future

Docker

↓

Docker Compose

↓

Kubernetes

↓

Helm

↓

GitHub Actions

---

# NFR-015 Testability

Current

Swagger

Manual API Testing

Future

Unit Testing

Integration Testing

Postman Collection

Load Testing

---

# NFR-016 Extensibility

Future services can be added without affecting existing services.

Example

```
Shipping API

Coupon API

Review API

Wishlist API

Recommendation API
```

Order API can consume these services later.

---

# NFR-017 Reusability

Shared.Contracts contains reusable DTOs.

Typed HttpClient can be reused.

Repository pattern can be reused.

Logging pattern can be reused.

---

# NFR-018 Coding Standards

Language

C#

Framework

.NET 9

Naming Convention

PascalCase

Private fields

_camelCase

Dependency Injection

Constructor Injection

Async methods

Suffix Async

Controllers

Thin Controllers

Business Logic

Services

Persistence

Repositories

---

# NFR-019 Error Handling

Current

HTTP Status Codes

200

201

204

400

404

500

Future

Global Exception Middleware

ProblemDetails

Correlation ID

---

# NFR-020 Future Cloud Native Readiness

The application has been intentionally designed so it can later support

- Docker
- Docker Compose
- Kubernetes
- Helm
- Horizontal Pod Autoscaler
- ConfigMap
- Secrets
- Ingress
- Rolling Update
- Rolling Rollback

without major code changes.

---

# Non-Functional Requirement Summary

| ID | Requirement |
|----|-------------|
| NFR-001 | Performance |
| NFR-002 | Scalability |
| NFR-003 | Availability |
| NFR-004 | Reliability |
| NFR-005 | Maintainability |
| NFR-006 | Modularity |
| NFR-007 | Loose Coupling |
| NFR-008 | High Cohesion |
| NFR-009 | Security |
| NFR-010 | Logging |
| NFR-011 | Monitoring |
| NFR-012 | Configuration |
| NFR-013 | Port Configuration |
| NFR-014 | Deployment |
| NFR-015 | Testability |
| NFR-016 | Extensibility |
| NFR-017 | Reusability |
| NFR-018 | Coding Standards |
| NFR-019 | Error Handling |
| NFR-020 | Cloud Native Readiness |

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


# 6. Solution Structure & Project Organization

---

# 6.1 Overview

The E-Commerce application is organized as a multi-project solution.

Each project has a single responsibility and can be independently developed, tested, containerized, and deployed.

The solution follows a modular architecture where each microservice owns its own business logic, repository, configuration, and API endpoints.

---

# 6.2 Solution Structure

```

Ecommerce

│

├── Ecommerce.sln

│

├── src

│   │

│   ├── Customer.Api

│   ├── Inventory.Api

│   ├── Payment.Api

│   ├── Notification.Api

│   ├── Order.Api

│   ├── Shared.Contracts

│   └── WebUI (Future)

│

├── docker (Future)

│

├── k8s (Future)

│

├── helm (Future)

│

├── scripts

│

└── README.md

```

---

# 6.3 Solution Responsibility

| Project | Responsibility |
|----------|----------------|
| Customer.Api | Customer Management |
| Inventory.Api | Product & Inventory |
| Payment.Api | Payment Processing |
| Notification.Api | Notification Processing |
| Order.Api | Order Orchestration |
| Shared.Contracts | Shared DTOs |
| WebUI | React Application |

---

# 6.4 Customer.Api Structure

```

Customer.Api

│

├── Controllers

│      CustomersController.cs

│

├── Models

│      Customer.cs

│

├── Repositories

│      ICustomerRepository.cs

│      CustomerRepository.cs

│

├── Services

│      ICustomerService.cs (Optional)

│      CustomerService.cs (Optional)

│

├── Properties

│      launchSettings.json

│

├── appsettings.json

├── Program.cs

└── Customer.Api.csproj

```

---

## Folder Responsibilities

### Controllers

Receives HTTP requests.

Responsibilities

- Routing
- Model Binding
- Calling Services
- Returning HTTP Responses

---

### Models

Contains domain models.

Example

Customer

Represents customer information stored in memory.

---

### Repositories

Responsible for data access.

Current Storage

```

List<Customer>

```

Future

```

SQL Server

Entity Framework Core

```

---

### Services

Contains business logic.

Responsibilities

- Validation
- Business Rules
- Calling Repository

---

### Program.cs

Application startup.

Responsibilities

- Register Services
- Register Repository
- Swagger
- Dependency Injection
- Http Pipeline

---

# 6.5 Inventory.Api Structure

```

Inventory.Api

│

├── Controllers

│      ProductsController.cs

│

├── Models

│      Product.cs

│      ReserveStockRequest.cs

│      ReserveStockResponse.cs

│

├── Repositories

│      ProductRepository.cs

│

├── Services

│      InventoryService.cs

│

├── Program.cs

├── appsettings.json

└── launchSettings.json

```

Responsibilities

Inventory API manages

- Products
- Inventory Quantity
- Stock Reservation

---

# 6.6 Payment.Api Structure

```

Payment.Api

│

├── Controllers

│      PaymentsController.cs

│

├── Models

│      Payment.cs

│

├── Repositories

│      PaymentRepository.cs

│

├── Services

│      PaymentService.cs

│

├── Program.cs

└── appsettings.json

```

Responsibilities

- Process Payment
- Save Payment
- Return Transaction Id

---

# 6.7 Notification.Api Structure

```

Notification.Api

│

├── Controllers

│      NotificationsController.cs

│

├── Models

│      NotificationMessage.cs

│

├── Repositories

│      NotificationRepository.cs

│

├── Services

│      NotificationService.cs

│

├── Program.cs

└── appsettings.json

```

Responsibilities

- Simulate Email Notification
- Save Notification History

---

# 6.8 Order.Api Structure

```

Order.Api

│

├── Controllers

│      OrdersController.cs

│

├── Models

│      Order.cs

│      OrderRequest.cs

│      OrderResponse.cs

│

├── Repositories

│      OrderRepository.cs

│

├── Services

│      OrderService.cs

│

├── HttpClients

│      CustomerApiClient.cs

│      InventoryApiClient.cs

│      PaymentApiClient.cs

│      NotificationApiClient.cs

│

├── Program.cs

├── appsettings.json

└── launchSettings.json

```

Responsibilities

- Receive Order Request
- Call Other APIs
- Save Order

---

# 6.9 Shared.Contracts Structure

```

Shared.Contracts

│

├── Customer

│      CustomerDto.cs

│

├── Inventory

│      ReserveStockRequest.cs

│      ReserveStockResponse.cs

│

├── Payment

│      PaymentRequest.cs

│      PaymentResponse.cs

│

├── Notification

│      NotificationRequest.cs

│      NotificationResponse.cs

│

└── Shared.Contracts.csproj

```

Purpose

Provide common request and response models for inter-service communication.

---

# 6.10 Dependency Graph

```

                 Shared.Contracts

                        ▲

                        │

       ┌────────────────┼────────────────┐

       │                │                │

       ▼                ▼                ▼

Customer.Api     Inventory.Api     Payment.Api

       │

       ▼

Notification.Api

       │

       ▼

Order.Api

```

Project References

Order.Api references

- Shared.Contracts

Customer.Api references

- Shared.Contracts

Inventory.Api references

- Shared.Contracts

Payment.Api references

- Shared.Contracts

Notification.Api references

- Shared.Contracts

---

# 6.11 Dependency Injection

Each API registers

Repository

↓

Service

↓

Controllers

Example

```

builder.Services.AddSingleton<IRepository, Repository>();

builder.Services.AddSingleton<IService, Service>();

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

```

Order API additionally registers

```

Typed HttpClient

CustomerApiClient

InventoryApiClient

PaymentApiClient

NotificationApiClient

```

---

# 6.12 Configuration Files

Each API contains

```

Program.cs

appsettings.json

launchSettings.json

```

Responsibilities

Program.cs

- Configure Services
- Configure Middleware
- Configure Swagger
- Configure HttpClients

---

appsettings.json

Contains

- Logging
- Allowed Hosts
- Service URLs (Order API)

Example

```

Services

CustomerApi

InventoryApi

PaymentApi

NotificationApi

```

---

launchSettings.json

Contains

- HTTP Port
- HTTPS Port
- Environment Variables

Example

```

Customer API

HTTP

5001

HTTPS

7001

```

---

# 6.13 NuGet Packages

Common packages

```

Microsoft.AspNetCore.OpenApi

Swashbuckle.AspNetCore

```

Framework

```

.NET 9

```

---

# 6.14 Build Dependencies

```

Shared.Contracts

↓

Customer.Api

Inventory.Api

Payment.Api

Notification.Api

↓

Order.Api

```

Order API consumes DTOs from Shared.Contracts and communicates with downstream services using Typed HttpClient.

---

# 6.15 Startup Flow

```

Application Starts

↓

Program.cs

↓

Read appsettings.json

↓

Register DI

↓

Register Swagger

↓

Configure Middleware

↓

Application Ready

↓

Accept HTTP Requests

```

---

# 6.16 Development Environment

Operating System

Windows 11

IDE

Visual Studio Code

SDK

.NET 9 SDK

Package Manager

NuGet

Source Control

Git

Repository

GitHub

---

# 6.17 Future Project Structure

```

Ecommerce

│

├── src

│   ├── Customer.Api

│   ├── Inventory.Api

│   ├── Payment.Api

│   ├── Notification.Api

│   ├── Order.Api

│   ├── Shared.Contracts

│   └── WebUI

│

├── docker

│      Dockerfiles

│

├── compose

│      docker-compose.yml

│

├── k8s

│      Deployment.yaml

│      Service.yaml

│      Ingress.yaml

│      ConfigMap.yaml

│      Secret.yaml

│

├── helm

│

└── github

       workflows


```
# 7. Customer API - Low Level Design (LLD)

---

# 7.1 Overview

Customer API is responsible for managing customer information within the E-Commerce application.

It is the authoritative source for customer-related data and exposes REST APIs for creating, retrieving, and deleting customers.

The service is completely independent and does not depend on any other microservice.

---

# 7.2 Responsibilities

The Customer API is responsible for:

- Creating customers
- Retrieving all customers
- Retrieving customer by Id
- Deleting customers
- Maintaining customer information in memory

The Customer API does NOT perform:

- Payment processing
- Inventory management
- Order creation
- Notification sending

These responsibilities belong to other microservices.

---

# 7.3 Architecture

```

                    HTTP Request

                          │

                          ▼

              CustomersController

                          │

                          ▼

                CustomerRepository

                          │

                          ▼

                List<Customer>

```

Current implementation skips the Service layer because business logic is minimal.

Future versions may introduce a CustomerService layer.

---

# 7.4 Folder Structure

```

Customer.Api

│

├── Controllers

│      CustomersController.cs

│

├── Models

│      Customer.cs

│

├── Repositories

│      ICustomerRepository.cs

│      CustomerRepository.cs

│

├── Properties

│      launchSettings.json

│

├── appsettings.json

├── Program.cs

└── Customer.Api.csproj

```

---

# 7.5 Class Responsibilities

## CustomersController

Responsibilities

- Receives HTTP requests
- Performs model binding
- Calls Repository
- Returns HTTP response
- Logs operations

---

## CustomerRepository

Responsibilities

- Store customers
- Retrieve customers
- Delete customers

Current storage

```

static List<Customer>

```

Future storage

```

SQL Server

Entity Framework Core

```

---

## Customer Model

Represents customer information.

---

# 7.6 Data Model

## Customer

| Property | Type | Description |
|-----------|------|-------------|
| Id | int | Auto-generated customer identifier |
| Name | string | Customer name |
| Email | string | Customer email address |

Example

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@test.com"
}
```

---

# 7.7 Repository Design

Interface

```
ICustomerRepository
```

Methods

```csharp
GetAll()

Get(int id)

Add(Customer customer)

Delete(int id)
```

---

## GetAll()

Purpose

Returns all customers.

Input

None

Output

```
IEnumerable<Customer>
```

---

## Get()

Purpose

Returns customer by Id.

Input

```
Id
```

Output

```
Customer
```

Returns null if not found.

---

## Add()

Purpose

Creates customer.

Input

```
Customer
```

Output

```
Customer
```

Behavior

- Auto-generates Id.
- Stores customer in memory.

---

## Delete()

Purpose

Deletes customer.

Input

```
Id
```

Output

```
bool
```

---

# 7.8 REST API Specification

---

## Endpoint 1

### Get All Customers

Method

```
GET
```

URL

```
/api/customers
```

Request Body

None

Success Response

HTTP 200

```json
[
  {
    "id":1,
    "name":"John",
    "email":"john@test.com"
  }
]
```

---

## Endpoint 2

### Get Customer By Id

Method

```
GET
```

URL

```
/api/customers/{id}
```

Example

```
GET /api/customers/1
```

Response

HTTP 200

```json
{
  "id":1,
  "name":"John",
  "email":"john@test.com"
}
```

Not Found

HTTP 404

---

## Endpoint 3

### Create Customer

Method

```
POST
```

URL

```
/api/customers
```

Request

```json
{
  "name":"John",
  "email":"john@test.com"
}
```

Success

HTTP 201

```json
{
  "id":1,
  "name":"John",
  "email":"john@test.com"
}
```

---

## Endpoint 4

### Delete Customer

Method

```
DELETE
```

URL

```
/api/customers/{id}
```

Example

```
DELETE /api/customers/1
```

Response

HTTP 204

If customer not found

HTTP 404

---

# 7.9 Request Flow

### Create Customer

```

React

↓

POST /api/customers

↓

CustomersController

↓

CustomerRepository

↓

List<Customer>

↓

Return Created Customer

```

---

### Get Customer

```

React

↓

GET /api/customers/{id}

↓

CustomersController

↓

CustomerRepository

↓

Customer Found

↓

Return Customer

```

---

### Delete Customer

```

React

↓

DELETE /api/customers/{id}

↓

CustomersController

↓

CustomerRepository

↓

Remove Customer

↓

Return 204

```

---

# 7.10 Logging

Current Logs

```
Getting all customers

Creating customer John

Deleting customer

Customer not found
```

Future

```
Correlation Id

Request Id

Execution Time

Structured Logging
```

---

# 7.11 Validation Rules

Current

- Name required
- Email required

Future

- Email format validation
- Duplicate email validation
- Maximum length validation

---

# 7.12 Error Handling

| Status | Description |
|---------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted |
| 400 | Invalid Request |
| 404 | Customer Not Found |
| 500 | Internal Server Error |

---

# 7.13 Configuration

HTTP Port

```
5001
```

HTTPS Port

```
7001
```

Swagger

```
http://localhost:5001/swagger
```

---

# 7.14 Dependencies

Depends On

```
None
```

Used By

```
Order API
```

The Order API calls

```
GET /api/customers/{id}
```

to validate that the customer exists before creating an order.

---

# 7.15 Future Enhancements

Future versions may include:

- SQL Server
- Entity Framework Core
- Customer Update API
- Customer Search
- Pagination
- Sorting
- Filtering
- JWT Authentication
- Role-Based Authorization
- Unit Tests
- Integration Tests
- Health Checks
- Docker Container
- Kubernetes Deployment

# 8. Inventory API - Low Level Design (LLD)

---

# 8.1 Overview

Inventory API is responsible for managing products and product inventory within the E-Commerce application.

It maintains the available stock for each product and exposes APIs for creating products, retrieving products, and reserving inventory during order placement.

Inventory API is the only service responsible for modifying product quantity.

---

# 8.2 Responsibilities

Inventory API is responsible for:

- Creating products
- Viewing all products
- Viewing a product by Id
- Reserving inventory
- Maintaining stock quantity

Inventory API is NOT responsible for:

- Processing payments
- Creating orders
- Managing customers
- Sending notifications

---

# 8.3 Architecture

```
                    HTTP Request
                          │
                          ▼
                 ProductsController
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
        InventoryService     ProductRepository
                 │                 │
                 └────────┬────────┘
                          ▼
                    List<Product>
```

Unlike Customer API, Inventory API contains a Service layer because stock reservation contains business logic.

---

# 8.4 Folder Structure

```
Inventory.Api
│
├── Controllers
│      ProductsController.cs
│
├── Models
│      Product.cs
│      ReserveStockRequest.cs
│      ReserveStockResponse.cs
│
├── Repositories
│      IProductRepository.cs
│      ProductRepository.cs
│
├── Services
│      IInventoryService.cs
│      InventoryService.cs
│
├── Properties
│      launchSettings.json
│
├── appsettings.json
├── Program.cs
└── Inventory.Api.csproj
```

---

# 8.5 Class Responsibilities

## ProductsController

Responsibilities

- Receive HTTP requests
- Validate request model
- Call InventoryService
- Return HTTP response

---

## InventoryService

Responsibilities

- Validate product existence
- Check available quantity
- Reserve inventory
- Return reservation result

---

## ProductRepository

Responsibilities

- Store products
- Retrieve products
- Update quantity

Current Storage

```
static List<Product>
```

Future Storage

```
SQL Server
Entity Framework Core
```

---

# 8.6 Domain Model

## Product

| Property | Type | Description |
|-----------|------|-------------|
| Id | int | Product Identifier |
| Name | string | Product Name |
| Price | decimal | Product Price |
| Quantity | int | Available Stock |

Example

```json
{
    "id":1,
    "name":"iPhone 16",
    "price":90000,
    "quantity":20
}
```

---

# 8.7 Shared Contracts

ReserveStockRequest

| Property | Type |
|-----------|------|
| ProductId | int |
| Quantity | int |

Example

```json
{
    "productId":1,
    "quantity":2
}
```

---

ReserveStockResponse

| Property | Type |
|-----------|------|
| Success | bool |
| Message | string |
| RemainingStock | int |

Example

```json
{
    "success":true,
    "message":"Stock Reserved",
    "remainingStock":18
}
```

---

# 8.8 Repository Design

Interface

```
IProductRepository
```

Methods

```
GetAll()

GetById(int id)

Add(Product product)
```

---

## GetAll()

Returns all products.

---

## GetById()

Returns a single product.

Returns null if product does not exist.

---

## Add()

Creates a new product.

Behavior

- Auto-generate Id
- Store product
- Return created product

---

# 8.9 Inventory Service Design

Method

```
ReserveStock()
```

Input

```
ReserveStockRequest
```

Output

```
ReserveStockResponse
```

Business Logic

```
Find Product

↓

Product Exists ?

↓

NO

↓

Return Failure

↓

YES

↓

Enough Quantity ?

↓

NO

↓

Return Failure

↓

YES

↓

Decrease Quantity

↓

Return Success
```

---

# 8.10 REST API Specification

---

## Endpoint 1

### Get Products

Method

```
GET
```

URL

```
/api/products
```

Response

HTTP 200

```json
[
    {
        "id":1,
        "name":"iPhone",
        "price":90000,
        "quantity":10
    }
]
```

---

## Endpoint 2

### Get Product By Id

Method

```
GET
```

URL

```
/api/products/{id}
```

Example

```
GET /api/products/1
```

Response

```json
{
    "id":1,
    "name":"iPhone",
    "price":90000,
    "quantity":10
}
```

HTTP 404 if not found.

---

## Endpoint 3

### Create Product

Method

```
POST
```

URL

```
/api/products
```

Request

```json
{
    "name":"MacBook Pro",
    "price":220000,
    "quantity":15
}
```

Response

HTTP 201

---

## Endpoint 4

### Reserve Product

Method

```
POST
```

URL

```
/api/products/reserve
```

Request

```json
{
    "productId":1,
    "quantity":2
}
```

Response

```json
{
    "success":true,
    "message":"Stock Reserved",
    "remainingStock":18
}
```

Failure Example

```json
{
    "success":false,
    "message":"Insufficient Stock",
    "remainingStock":1
}
```

---

# 8.11 Sequence Diagram

```
Order API

        │

POST /reserve

        │

        ▼

ProductsController

        │

        ▼

InventoryService

        │

Check Product

        │

Check Quantity

        │

Update Quantity

        │

Return Response
```

---

# 8.12 Business Rules

BR-001

Product must exist.

---

BR-002

Requested quantity must be greater than zero.

---

BR-003

Available quantity must be greater than or equal to requested quantity.

---

BR-004

Inventory cannot become negative.

---

# 8.13 Logging

Current Logs

```
Returning all products

Reserve request received

Product Found

Stock Reserved

Insufficient Stock
```

Future

```
Execution Time

Correlation Id

Distributed Trace Id
```

---

# 8.14 Error Handling

| Status | Description |
|----------|-------------|
|200|Success|
|201|Created|
|400|Invalid Request|
|404|Product Not Found|
|500|Internal Server Error|

---

# 8.15 Configuration

HTTP Port

```
5002
```

HTTPS Port

```
7002
```

Swagger

```
http://localhost:5002/swagger
```

---

# 8.16 Dependencies

Depends On

```
None
```

Used By

```
Order API
```

Order API calls

```
POST /api/products/reserve
```

during order placement.

---

# 8.17 Future Enhancements

Future versions may include:

- Update Product API
- Delete Product API
- Product Search
- Product Categories
- Image Upload
- SQL Server
- Entity Framework Core
- Inventory Audit
- Low Stock Alerts
- Event Publishing
- Redis Cache
- Docker
- Kubernetes
- Helm

# 9. Payment API - Low Level Design (LLD)

---

# 9.1 Overview

The Payment API is responsible for processing payments for customer orders.

In the current version, the payment process is simulated. Every payment request is considered successful and the payment information is stored in an in-memory repository.

The Payment API acts as an independent microservice and does not interact directly with any other service except through REST APIs.

The Order API invokes the Payment API during the order placement workflow.

---

# 9.2 Responsibilities

The Payment API is responsible for:

- Processing customer payments
- Generating transaction identifiers
- Recording payment history
- Returning payment status

The Payment API is NOT responsible for:

- Customer validation
- Product inventory
- Order creation
- Notification sending

---

# 9.3 Architecture

```

                    HTTP Request

                          │

                          ▼

                PaymentsController

                          │

                          ▼

                  PaymentService

                          │

                          ▼

                PaymentRepository

                          │

                          ▼

                  List<Payment>

```

Business logic is implemented inside the Service layer.

---

# 9.4 Folder Structure

```
Payment.Api

│

├── Controllers

│      PaymentsController.cs

│

├── Models

│      Payment.cs

│      PaymentRequest.cs

│      PaymentResponse.cs

│

├── Repositories

│      IPaymentRepository.cs

│      PaymentRepository.cs

│

├── Services

│      IPaymentService.cs

│      PaymentService.cs

│

├── Properties

│      launchSettings.json

│

├── appsettings.json

├── Program.cs

└── Payment.Api.csproj
```

---

# 9.5 Class Responsibilities

## PaymentsController

Responsibilities

- Receive HTTP requests
- Call PaymentService
- Return HTTP responses
- Log payment operations

---

## PaymentService

Responsibilities

- Validate payment request
- Simulate payment processing
- Generate transaction identifier
- Save payment
- Return payment response

---

## PaymentRepository

Responsibilities

- Store payment records
- Retrieve payment history

Current Storage

```
static List<Payment>
```

Future Storage

```
SQL Server

Entity Framework Core
```

---

# 9.6 Domain Model

## Payment

| Property | Type | Description |
|-----------|------|-------------|
| Id | int | Payment Identifier |
| OrderId | int | Related Order |
| Amount | decimal | Payment Amount |
| Status | string | Payment Status |
| CreatedAt | DateTime | Payment Time |

Example

```json
{
    "id":1,
    "orderId":1,
    "amount":180000,
    "status":"Success",
    "createdAt":"2026-08-04T12:15:10Z"
}
```

---

# 9.7 Shared Contracts

## PaymentRequest

| Property | Type |
|-----------|------|
| OrderId | int |
| Amount | decimal |

Example

```json
{
    "orderId":1,
    "amount":180000
}
```

---

## PaymentResponse

| Property | Type |
|-----------|------|
| Success | bool |
| TransactionId | string |
| Message | string |

Example

```json
{
    "success":true,
    "transactionId":"8b1d25c7-fd5f-41fd-bc67-0fc88d68d640",
    "message":"Payment Successful"
}
```

---

# 9.8 Repository Design

Interface

```
IPaymentRepository
```

Methods

```
GetAll()

Add(Payment payment)
```

---

## GetAll()

Purpose

Returns all payment records.

Output

```
IEnumerable<Payment>
```

---

## Add()

Purpose

Stores payment information.

Behavior

- Auto-generates payment Id
- Sets CreatedAt
- Stores payment in memory

Returns

```
Payment
```

---

# 9.9 Service Design

Method

```
ProcessPaymentAsync()
```

Input

```
PaymentRequest
```

Output

```
PaymentResponse
```

Business Logic

```
Receive Payment Request

↓

Validate Request

↓

Simulate Payment Gateway

↓

Generate Transaction Id

↓

Create Payment Object

↓

Save Payment

↓

Return Success
```

Current implementation simulates payment processing using an artificial delay.

Future implementation will integrate with a payment gateway.

---

# 9.10 REST API Specification

---

## Endpoint 1

### Process Payment

Method

```
POST
```

URL

```
/api/payments
```

Request

```json
{
    "orderId":1,
    "amount":180000
}
```

Success Response

HTTP 200

```json
{
    "success":true,
    "transactionId":"8b1d25c7-fd5f-41fd-bc67-0fc88d68d640",
    "message":"Payment Successful"
}
```

---

## Endpoint 2

### Get Payments

Method

```
GET
```

URL

```
/api/payments
```

Response

HTTP 200

```json
[
    {
        "id":1,
        "orderId":1,
        "amount":180000,
        "status":"Success",
        "createdAt":"2026-08-04T12:15:10Z"
    }
]
```

---

# 9.11 Sequence Diagram

```
Order API

      │

POST /api/payments

      │

      ▼

PaymentsController

      │

      ▼

PaymentService

      │

Generate Transaction Id

      │

Create Payment

      │

Save Payment

      │

Return PaymentResponse
```

---

# 9.12 Business Rules

### BR-001

OrderId must be greater than zero.

---

### BR-002

Amount must be greater than zero.

---

### BR-003

Every successful payment generates a unique TransactionId.

---

### BR-004

Payment history must be preserved until the application stops.

(Current implementation uses in-memory storage.)

---

# 9.13 Logging

Current Logs

```
Payment Request Received

Processing Payment

Payment Successful

Returning Payment Response
```

Future

```
Payment Started

Payment Completed

Payment Failed

Gateway Response Time

Correlation Id

Trace Id
```

---

# 9.14 Error Handling

| Status Code | Description |
|--------------|-------------|
|200|Payment Processed|
|400|Invalid Request|
|404|Order Not Found (Future)|
|500|Internal Server Error|

---

# 9.15 Configuration

HTTP Port

```
5003
```

HTTPS Port

```
7003
```

Swagger

```
http://localhost:5003/swagger
```

---

# 9.16 Dependencies

Depends On

```
None
```

Used By

```
Order API
```

The Order API invokes

```
POST /api/payments
```

after successful inventory reservation.

---

# 9.17 Current Limitations

Current implementation:

- Always succeeds
- No external payment gateway
- No payment validation
- No fraud detection
- No refunds
- No payment cancellation
- No duplicate payment detection

These limitations are acceptable for Version 1 because the focus is learning microservices and Kubernetes.

---

# 9.18 Future Enhancements

Future versions may include:

- Stripe Integration
- Razorpay Integration
- PayPal Integration
- UPI Support
- Credit Card Processing
- Payment Retry
- Refund API
- Payment Status API
- SQL Server
- Entity Framework Core
- Event Publishing
- RabbitMQ
- Redis Cache
- JWT Authentication
- Docker
- Kubernetes
- Helm
- Health Checks
- OpenTelemetry

# 10. Notification API - Low Level Design (LLD)

---

# 10.1 Overview

The Notification API is responsible for sending customer notifications after successful business operations.

In the current version, the service simulates sending an email notification and stores the notification details in an in-memory repository.

The Notification API does not integrate with any external email provider in Version 1.

The Order API invokes this service after a successful payment.

---

# 10.2 Responsibilities

Notification API is responsible for:

- Sending order confirmation notifications
- Recording notification history
- Returning notification status

Notification API is NOT responsible for:

- Customer Management
- Product Management
- Inventory Reservation
- Payment Processing
- Order Creation

---

# 10.3 Architecture

```

                    HTTP Request

                          │

                          ▼

            NotificationsController

                          │

                          ▼

               NotificationService

                          │

                          ▼

            NotificationRepository

                          │

                          ▼

          List<NotificationMessage>

```

Business logic resides in the Service layer.

---

# 10.4 Folder Structure

```

Notification.Api

│

├── Controllers

│      NotificationsController.cs

│

├── Models

│      NotificationMessage.cs

│

├── Repositories

│      INotificationRepository.cs

│      NotificationRepository.cs

│

├── Services

│      INotificationService.cs

│      NotificationService.cs

│

├── Properties

│      launchSettings.json

│

├── appsettings.json

├── Program.cs

└── Notification.Api.csproj

```

---

# 10.5 Class Responsibilities

## NotificationsController

Responsibilities

- Receive HTTP requests
- Validate request
- Call NotificationService
- Return HTTP responses

---

## NotificationService

Responsibilities

- Simulate sending email
- Save notification history
- Return notification status

---

## NotificationRepository

Responsibilities

- Store notification history
- Return notification history

Current Storage

```

static List<NotificationMessage>

```

Future Storage

```

SQL Server

Entity Framework Core

```

---

# 10.6 Domain Model

## NotificationMessage

| Property | Type | Description |
|-----------|------|-------------|
| Id | int | Notification Identifier |
| CustomerName | string | Customer Name |
| Email | string | Customer Email |
| Subject | string | Email Subject |
| Message | string | Notification Body |
| SentAt | DateTime | Notification Timestamp |

Example

```json
{
    "id":1,
    "customerName":"John Doe",
    "email":"john@test.com",
    "subject":"Order Created",
    "message":"Your order has been placed successfully.",
    "sentAt":"2026-08-04T15:20:30Z"
}
```

---

# 10.7 Shared Contracts

## NotificationRequest

| Property | Type |
|-----------|------|
| CustomerName | string |
| Email | string |
| Subject | string |
| Message | string |

Example

```json
{
    "customerName":"John Doe",
    "email":"john@test.com",
    "subject":"Order Created",
    "message":"Your order has been placed successfully."
}
```

---

## NotificationResponse

| Property | Type |
|-----------|------|
| Success | bool |
| Status | string |

Example

```json
{
    "success":true,
    "status":"Notification Sent"
}
```

---

# 10.8 Repository Design

Interface

```
INotificationRepository
```

Methods

```
GetAll()

Add(NotificationMessage notification)
```

---

## GetAll()

Purpose

Returns all notifications.

Output

```
IEnumerable<NotificationMessage>
```

---

## Add()

Purpose

Stores notification.

Behavior

- Auto-generates Id
- Sets SentAt timestamp
- Saves notification in memory

Returns

```
NotificationMessage
```

---

# 10.9 Service Design

Method

```
SendAsync()
```

Input

```
NotificationRequest
```

Output

```
NotificationResponse
```

Business Logic

```
Receive Notification Request

↓

Validate Request

↓

Simulate Email Sending

↓

Create Notification Object

↓

Save Notification

↓

Return Success
```

The current implementation simulates email delivery using an artificial delay.

Future versions will integrate with an email provider.

---

# 10.10 REST API Specification

---

## Endpoint 1

### Send Notification

Method

```
POST
```

URL

```
/api/notifications
```

Request

```json
{
    "customerName":"John Doe",
    "email":"john@test.com",
    "subject":"Order Created",
    "message":"Your order has been placed successfully."
}
```

Success Response

HTTP 200

```json
{
    "success":true,
    "status":"Notification Sent"
}
```

---

## Endpoint 2

### Get Notification History

Method

```
GET
```

URL

```
/api/notifications
```

Response

HTTP 200

```json
[
    {
        "id":1,
        "customerName":"John Doe",
        "email":"john@test.com",
        "subject":"Order Created",
        "message":"Your order has been placed successfully.",
        "sentAt":"2026-08-04T15:20:30Z"
    }
]
```

---

# 10.11 Sequence Diagram

```
Order API

      │

POST /api/notifications

      │

      ▼

NotificationsController

      │

      ▼

NotificationService

      │

Simulate Email

      │

Create Notification

      │

Save Notification

      │

Return Success
```

---

# 10.12 Business Rules

### BR-001

Customer Name is mandatory.

---

### BR-002

Email is mandatory.

---

### BR-003

Subject is mandatory.

---

### BR-004

Message body is mandatory.

---

### BR-005

Notification history is stored until the application stops.

(Current implementation uses in-memory storage.)

---

# 10.13 Logging

Current Logs

```
Notification Request Received

Sending Notification

Notification Saved

Notification Sent
```

Future

```
Email Provider Response

SMTP Response

Correlation Id

Execution Time

Distributed Trace Id
```

---

# 10.14 Error Handling

| Status Code | Description |
|--------------|-------------|
|200|Notification Sent|
|400|Invalid Request|
|500|Internal Server Error|

---

# 10.15 Configuration

HTTP Port

```
5004
```

HTTPS Port

```
7004
```

Swagger

```
http://localhost:5004/swagger
```

---

# 10.16 Dependencies

Depends On

```
None
```

Used By

```
Order API
```

The Order API invokes

```
POST /api/notifications
```

after successful payment processing.

---

# 10.17 Current Limitations

Current implementation:

- Simulated email delivery
- No SMTP integration
- No SendGrid integration
- No Azure Communication Services
- No retry mechanism
- No delivery status tracking
- No attachments
- No HTML templates

---

# 10.18 Future Enhancements

Future versions may include:

- SMTP Integration
- SendGrid
- Azure Communication Services
- AWS SES
- SMS Notifications
- Push Notifications
- WhatsApp Notifications
- Retry Policy
- Notification Templates
- Delivery Status Tracking
- SQL Server
- RabbitMQ
- Docker
- Kubernetes
- Helm
- OpenTelemetry

# 11. Order API - Low Level Design (LLD)

---

# 11.1 Overview

The Order API is the central orchestration service of the E-Commerce application.

Unlike the other microservices, the Order API does not own all business operations. Instead, it coordinates multiple downstream microservices to complete the order placement workflow.

The Order API is responsible for validating customer information, reserving inventory, processing payments, sending notifications, and finally persisting the order.

The frontend communicates directly with the Order API when placing an order.

---

# 11.2 Responsibilities

The Order API is responsible for:

- Accepting order requests from the frontend
- Validating customer existence
- Reserving product inventory
- Processing payment
- Sending notification
- Saving order
- Returning final order response

The Order API is NOT responsible for:

- Managing customers
- Managing inventory
- Processing payment logic
- Sending emails

Those responsibilities belong to their respective services.

---

# 11.3 Architecture

```

                    React UI

                        │

                        ▼

               OrdersController

                        │

                        ▼

                  OrderService

                        │

      ┌─────────────────┼───────────────────┐

      ▼                 ▼                   ▼

CustomerApiClient   InventoryApiClient   PaymentApiClient

                                              │

                                              ▼

                                  NotificationApiClient

                        │

                        ▼

                OrderRepository

                        │

                        ▼

                 List<Order>

```

The OrderService acts as the orchestration layer.

---

# 11.4 Folder Structure

```
Order.Api

│

├── Controllers
│      OrdersController.cs
│
├── Models
│      Order.cs
│      OrderRequest.cs
│      OrderResponse.cs
│
├── HttpClients
│      CustomerApiClient.cs
│      InventoryApiClient.cs
│      PaymentApiClient.cs
│      NotificationApiClient.cs
│
├── Repositories
│      IOrderRepository.cs
│      OrderRepository.cs
│
├── Services
│      IOrderService.cs
│      OrderService.cs
│
├── Properties
│      launchSettings.json
│
├── appsettings.json
├── Program.cs
└── Order.Api.csproj
```

---

# 11.5 Class Responsibilities

## OrdersController

Responsibilities

- Receive order requests
- Call OrderService
- Return HTTP response

No business logic should exist inside the controller.

---

## OrderService

Responsibilities

- Validate customer
- Reserve inventory
- Process payment
- Send notification
- Save order
- Return response

This is the orchestration layer.

---

## OrderRepository

Responsibilities

- Store orders
- Retrieve orders

Current Storage

```
static List<Order>
```

Future

```
SQL Server

Entity Framework Core
```

---

## HttpClients

Responsibilities

Provide strongly typed communication between Order API and downstream services.

```
CustomerApiClient

InventoryApiClient

PaymentApiClient

NotificationApiClient
```

Each client wraps HTTP communication.

---

# 11.6 Domain Model

## Order

| Property | Type | Description |
|-----------|------|-------------|
| Id | int | Order Identifier |
| CustomerId | int | Customer Identifier |
| ProductId | int | Product Identifier |
| Quantity | int | Ordered Quantity |
| Amount | decimal | Order Amount |
| Status | string | Order Status |
| CreatedAt | DateTime | Order Timestamp |

Example

```json
{
  "id":1,
  "customerId":1,
  "productId":1,
  "quantity":2,
  "amount":180000,
  "status":"Completed",
  "createdAt":"2026-08-04T12:45:30Z"
}
```

---

# 11.7 OrderRequest

Request received from React UI.

```json
{
  "customerId":1,
  "productId":1,
  "quantity":2,
  "amount":180000
}
```

---

# 11.8 OrderResponse

```json
{
  "success":true,
  "message":"Order Created Successfully",
  "orderId":1
}
```

---

# 11.9 Repository Design

Interface

```
IOrderRepository
```

Methods

```
GetAll()

GetById(int id)

Add(Order order)
```

---

## Add()

Responsibilities

- Generate Order Id
- Set CreatedAt
- Save Order
- Return created order

---

# 11.10 HttpClient Design

## CustomerApiClient

Purpose

Validate customer existence.

Request

```
GET

/api/customers/{id}
```

Response

```
CustomerDto
```

---

## InventoryApiClient

Purpose

Reserve stock.

Request

```
POST

/api/products/reserve
```

Response

```
ReserveStockResponse
```

---

## PaymentApiClient

Purpose

Process payment.

Request

```
POST

/api/payments
```

Response

```
PaymentResponse
```

---

## NotificationApiClient

Purpose

Send notification.

Request

```
POST

/api/notifications
```

Response

```
NotificationResponse
```

---

# 11.11 Order Processing Workflow

```
Receive Order Request

↓

Validate Customer

↓

Reserve Inventory

↓

Process Payment

↓

Send Notification

↓

Create Order

↓

Save Order

↓

Return Success
```

---

# 11.12 Complete Sequence Diagram

```
React UI

      │

POST /api/orders

      │

      ▼

OrdersController

      │

      ▼

OrderService

      │

GET Customer

──────────────► Customer API

◄──────────────

Customer Found

      │

POST Reserve Stock

──────────────► Inventory API

◄──────────────

Stock Reserved

      │

POST Payment

──────────────► Payment API

◄──────────────

Payment Successful

      │

POST Notification

──────────────► Notification API

◄──────────────

Notification Sent

      │

Save Order

      │

Return Response
```

---

# 11.13 Business Rules

BR-001

Customer must exist.

---

BR-002

Product must exist.

---

BR-003

Inventory reservation must succeed.

---

BR-004

Payment must succeed.

---

BR-005

Notification should be sent after successful payment.

---

BR-006

Order is saved only after all previous steps succeed.

---

# 11.14 Failure Scenarios

Scenario 1

Customer not found

↓

Return

```
Success = false

Message = Customer not found
```

---

Scenario 2

Inventory unavailable

↓

Return

```
Success = false

Message = Inventory reservation failed
```

---

Scenario 3

Payment failed

↓

Return

```
Success = false

Message = Payment failed
```

---

Scenario 4

Notification failed

Current Version

Notification failure does not rollback the order.

Future versions may introduce compensation logic or event-driven retries.

---

# 11.15 Dependency Injection

Program.cs registers

```
OrderRepository

↓

OrderService

↓

CustomerApiClient

↓

InventoryApiClient

↓

PaymentApiClient

↓

NotificationApiClient
```

Each HttpClient is configured using IConfiguration.

---

# 11.16 Configuration

appsettings.json

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

Program.cs binds these values to Typed HttpClients.

---

# 11.17 Logging

Current Logs

```
Order Request Received

Customer Validated

Inventory Reserved

Payment Successful

Notification Sent

Order Saved
```

Future

```
Correlation Id

Distributed Trace Id

Execution Time

Request Duration

OpenTelemetry Trace
```

---

# 11.18 Error Handling

| Status | Description |
|----------|-------------|
|200|Order Created|
|400|Invalid Request|
|404|Customer/Product Not Found|
|500|Internal Server Error|

---

# 11.19 Dependencies

Depends On

```
Customer API

Inventory API

Payment API

Notification API

Shared.Contracts
```

Used By

```
React UI
```

---

# 11.20 Future Enhancements

Future versions may include:

- Saga Pattern
- Event-Driven Architecture
- RabbitMQ
- Kafka
- Distributed Transactions
- Polly Retry
- Circuit Breaker
- Timeout Policies
- SQL Server
- Entity Framework Core
- Outbox Pattern
- Health Checks
- OpenTelemetry
- Prometheus
- Grafana
- Docker
- Kubernetes
- Helm
- GitHub Actions

# 12. Complete REST API Specification

---

# 12.1 Introduction

This section defines the REST API contract for all microservices.

It provides a centralized reference for frontend developers and external consumers.

Every endpoint includes:

- URL
- HTTP Method
- Description
- Request Parameters
- Request Body
- Success Response
- Error Response
- Status Codes
- Sample Request
- Sample Response

All APIs exchange data in JSON format.

Content-Type

```

application/json

```

---

# 12.2 Customer API

Base URL

```

http://localhost:5001

```

---

## API-001

### Get All Customers

**Endpoint**

```

GET /api/customers

```

Description

Returns all customers.

Headers

None

Request Body

None

Success Response

HTTP 200

```json
[
  {
    "id":1,
    "name":"John Doe",
    "email":"john@test.com"
  }
]
```

Possible Status Codes

| Code | Meaning |
|------|----------|
|200|Success|
|500|Internal Server Error|

---

## API-002

### Get Customer

Endpoint

```

GET /api/customers/{id}

```

Path Parameter

| Name | Type |
|------|------|
|id|int|

Example

```

GET /api/customers/1

```

Success Response

```json
{
  "id":1,
  "name":"John Doe",
  "email":"john@test.com"
}
```

Status Codes

| Code | Meaning |
|------|----------|
|200|Success|
|404|Customer Not Found|

---

## API-003

### Create Customer

Endpoint

```

POST /api/customers

```

Request

```json
{
  "name":"John Doe",
  "email":"john@test.com"
}
```

Success Response

HTTP 201

```json
{
  "id":1,
  "name":"John Doe",
  "email":"john@test.com"
}
```

Validation

| Field | Required |
|--------|----------|
|Name|Yes|
|Email|Yes|

---

## API-004

### Delete Customer

Endpoint

```

DELETE /api/customers/{id}

```

Response

HTTP 204

Status Codes

| Code | Meaning |
|------|----------|
|204|Deleted|
|404|Customer Not Found|

---

# 12.3 Inventory API

Base URL

```

http://localhost:5002

```

---

## API-005

### Get Products

Endpoint

```

GET /api/products

```

Response

```json
[
  {
    "id":1,
    "name":"iPhone",
    "price":90000,
    "quantity":20
  }
]
```

---

## API-006

### Get Product

Endpoint

```

GET /api/products/{id}

```

Example

```

GET /api/products/1

```

Success

```json
{
  "id":1,
  "name":"iPhone",
  "price":90000,
  "quantity":20
}
```

404

Product not found.

---

## API-007

### Create Product

Endpoint

```

POST /api/products

```

Request

```json
{
  "name":"MacBook",
  "price":220000,
  "quantity":15
}
```

Response

HTTP 201

---

## API-008

### Reserve Stock

Endpoint

```

POST /api/products/reserve

```

Request

```json
{
  "productId":1,
  "quantity":2
}
```

Success

```json
{
  "success":true,
  "message":"Stock Reserved",
  "remainingStock":18
}
```

Failure

```json
{
  "success":false,
  "message":"Insufficient Stock",
  "remainingStock":1
}
```

---

# 12.4 Payment API

Base URL

```

http://localhost:5003

```

---

## API-009

### Process Payment

Endpoint

```

POST /api/payments

```

Request

```json
{
  "orderId":1,
  "amount":180000
}
```

Success

```json
{
  "success":true,
  "transactionId":"xxxxxxxx-xxxx-xxxx",
  "message":"Payment Successful"
}
```

---

## API-010

### Get Payments

Endpoint

```

GET /api/payments

```

Response

```json
[
  {
    "id":1,
    "orderId":1,
    "amount":180000,
    "status":"Success",
    "createdAt":"2026-08-04T12:15:30Z"
  }
]
```

---

# 12.5 Notification API

Base URL

```

http://localhost:5004

```

---

## API-011

### Send Notification

Endpoint

```

POST /api/notifications

```

Request

```json
{
  "customerName":"John Doe",
  "email":"john@test.com",
  "subject":"Order Created",
  "message":"Your order has been placed successfully."
}
```

Success

```json
{
  "success":true,
  "status":"Notification Sent"
}
```

---

## API-012

### Get Notifications

Endpoint

```

GET /api/notifications

```

Response

```json
[
  {
    "id":1,
    "customerName":"John Doe",
    "email":"john@test.com",
    "subject":"Order Created",
    "message":"Your order has been placed successfully.",
    "sentAt":"2026-08-04T12:40:30Z"
  }
]
```

---

# 12.6 Order API

Base URL

```

http://localhost:5005

```

---

## API-013

### Get Orders

Endpoint

```

GET /api/orders

```

Response

```json
[
  {
    "id":1,
    "customerId":1,
    "productId":1,
    "quantity":2,
    "amount":180000,
    "status":"Completed",
    "createdAt":"2026-08-04T12:55:30Z"
  }
]
```

---

## API-014

### Get Order

Endpoint

```

GET /api/orders/{id}

```

Success

```json
{
  "id":1,
  "customerId":1,
  "productId":1,
  "quantity":2,
  "amount":180000,
  "status":"Completed",
  "createdAt":"2026-08-04T12:55:30Z"
}
```

404

Order not found.

---

## API-015

### Create Order

Endpoint

```

POST /api/orders

```

Request

```json
{
  "customerId":1,
  "productId":1,
  "quantity":2,
  "amount":180000
}
```

Successful Response

```json
{
  "success":true,
  "message":"Order Created Successfully",
  "orderId":1
}
```

Possible Failure Responses

Customer Not Found

```json
{
  "success":false,
  "message":"Customer not found"
}
```

Inventory Failure

```json
{
  "success":false,
  "message":"Inventory reservation failed"
}
```

Payment Failure

```json
{
  "success":false,
  "message":"Payment failed"
}
```

---

# 12.7 API Dependency Matrix

| API | Called By | Purpose |
|------|-----------|---------|
|Customer API|React, Order API|Customer Management & Validation|
|Inventory API|React, Order API|Product Management & Stock Reservation|
|Payment API|React, Order API|Payment Processing|
|Notification API|React, Order API|Notification History & Sending|
|Order API|React|Order Placement & Orchestration|

---

# 12.8 End-to-End Order Flow

```
React UI

    │

POST /api/orders

    │

    ▼

Order API

    │

GET /api/customers/{id}

    │

Customer API

    │

POST /api/products/reserve

    │

Inventory API

    │

POST /api/payments

    │

Payment API

    │

POST /api/notifications

    │

Notification API

    │

Save Order

    │

Return OrderResponse

    │

React UI
```

---

# 12.9 Standard HTTP Status Codes

| Status Code | Meaning |
|-------------|----------|
|200|Request Successful|
|201|Resource Created|
|204|Resource Deleted|
|400|Bad Request|
|404|Resource Not Found|
|500|Internal Server Error|

---

# 12.10 API Versioning

Current Version

```
v1
```

(Current implementation does not expose the version in the URL.)

Future recommendation

```
/api/v1/customers

/api/v1/orders

/api/v1/products
```

This will allow backward-compatible API evolution in future releases.

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

# 14. Data Design (Current & Future Database Design)

---

# 14.1 Overview

The current version of the E-Commerce application uses in-memory collections to store data.

The primary objective of Version 1 is to learn:

- ASP.NET Core
- REST APIs
- React
- Docker
- Kubernetes
- Helm
- CI/CD

Therefore, database persistence has intentionally been postponed.

Each repository maintains its own static collection.

Example

Customer Repository

↓

List<Customer>

Inventory Repository

↓

List<Product>

Order Repository

↓

List<Order>

Payment Repository

↓

List<Payment>

Notification Repository

↓

List<NotificationMessage>

When the application stops, all data is lost.

In Version 2 these collections will be replaced with SQL Server.

---

# 14.2 Current Data Storage

Current implementation

```

Customer Repository

↓

static List<Customer>

Inventory Repository

↓

static List<Product>

Payment Repository

↓

static List<Payment>

Notification Repository

↓

static List<NotificationMessage>

Order Repository

↓

static List<Order>

```

Advantages

- Fast
- No setup
- Easy to understand
- Good for Kubernetes learning

Disadvantages

- Data loss after restart
- No relationships
- No transactions
- No concurrency management

---

# 14.3 Future Database Architecture

Future implementation

```

                    SQL Server

                           │

        ┌──────────┬──────────┬──────────┬──────────┐

        ▼          ▼          ▼          ▼

 Customers   Products   Orders   Payments

                           │

                           ▼

                  Notifications

```

Every microservice will own its own database.

No database sharing.

---

# 14.4 Database per Service Pattern

Future Architecture

```

Customer API

↓

CustomerDB

----------------------------

Inventory API

↓

InventoryDB

----------------------------

Payment API

↓

PaymentDB

----------------------------

Notification API

↓

NotificationDB

----------------------------

Order API

↓

OrderDB

```

Benefits

- Loose Coupling

- Independent Scaling

- Independent Deployment

- Independent Backup

- Independent Migration

---

# 14.5 Customer Entity

Current Model

| Column | Type |
|----------|------|
| Id | int |
| Name | string |
| Email | string |

Future SQL Table

```
Customers
```

| Column | SQL Type | PK |
|----------|----------|----|
| Id | INT | Yes |
| Name | NVARCHAR(100) | No |
| Email | NVARCHAR(200) | No |

Primary Key

```
Id
```

Future Index

```
Email
```

---

# 14.6 Product Entity

Current Model

| Property | Type |
|-----------|------|
| Id | int |
| Name | string |
| Price | decimal |
| Quantity | int |

Future Table

```
Products
```

| Column | SQL Type |
|----------|----------|
| Id | INT |
| Name | NVARCHAR(200) |
| Price | DECIMAL(18,2) |
| Quantity | INT |

Primary Key

```
Id
```

---

# 14.7 Order Entity

Current Model

| Property | Type |
|-----------|------|
| Id | int |
| CustomerId | int |
| ProductId | int |
| Quantity | int |
| Amount | decimal |
| Status | string |
| CreatedAt | DateTime |

Future Table

```
Orders
```

| Column | SQL Type |
|----------|----------|
| Id | INT |
| CustomerId | INT |
| ProductId | INT |
| Quantity | INT |
| Amount | DECIMAL(18,2) |
| Status | NVARCHAR(50) |
| CreatedAt | DATETIME2 |

Primary Key

```
Id
```

Future Indexes

```
CustomerId

ProductId

CreatedAt
```

---

# 14.8 Payment Entity

Current Model

| Property | Type |
|-----------|------|
| Id | int |
| OrderId | int |
| Amount | decimal |
| Status | string |
| CreatedAt | DateTime |

Future Table

```
Payments
```

| Column | SQL Type |
|----------|----------|
| Id | INT |
| OrderId | INT |
| Amount | DECIMAL(18,2) |
| Status | NVARCHAR(50) |
| CreatedAt | DATETIME2 |

Primary Key

```
Id
```

Future Index

```
OrderId
```

---

# 14.9 Notification Entity

Current Model

| Property | Type |
|-----------|------|
| Id | int |
| CustomerName | string |
| Email | string |
| Subject | string |
| Message | string |
| SentAt | DateTime |

Future Table

```
Notifications
```

| Column | SQL Type |
|----------|----------|
| Id | INT |
| CustomerName | NVARCHAR(200) |
| Email | NVARCHAR(200) |
| Subject | NVARCHAR(300) |
| Message | NVARCHAR(MAX) |
| SentAt | DATETIME2 |

Primary Key

```
Id
```

---

# 14.10 Logical Entity Relationship

Current Version

```

Customer

↓

Order

↓

Payment

↓

Notification

```

Inventory

↓

Product

↓

Order

Although relationships exist logically, they are not enforced because every service owns its own data.

---

# 14.11 Future Entity Relationship Diagram

```

Customers

-----------------

CustomerId (PK)

Name

Email

        |

        |

Orders

-----------------

OrderId (PK)

CustomerId

ProductId

Amount

Status

        |

        |

Payments

-----------------

PaymentId (PK)

OrderId

Amount

Status

```

Inventory Database

```

Products

-----------------

ProductId

Name

Price

Quantity

```

Notification Database

```

Notifications

-----------------

NotificationId

CustomerName

Email

Subject

Message

SentAt

```

---

# 14.12 Data Ownership

Each microservice owns its own data.

Customer API

Owns

```
Customers
```

Inventory API

Owns

```
Products
```

Payment API

Owns

```
Payments
```

Notification API

Owns

```
Notifications
```

Order API

Owns

```
Orders
```

No microservice directly accesses another service's database.

Communication must always occur through REST APIs.

---

# 14.13 Future Persistence Technology

Current

```
In Memory
```

Future

```
SQL Server

↓

Entity Framework Core

↓

Repository Pattern

↓

Migrations

↓

Connection Pooling
```

---

# 14.14 Data Migration Strategy

Migration Path

Version 1

↓

In-Memory Repository

↓

Version 2

↓

Entity Framework Core

↓

SQL Server

↓

Azure SQL Database

No API contract changes are expected during this migration.

Only the Repository implementation will change.

---

# 14.15 Future Improvements

- SQL Server
- Entity Framework Core
- Database Migrations
- Optimistic Concurrency
- Transactions
- Soft Delete
- Audit Columns
- CreatedBy
- UpdatedBy
- RowVersion
- Index Optimization
- Query Performance Tuning

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

# 16. Docker & Containerization Design

---

# 16.1 Overview

This chapter describes the containerization strategy for the E-Commerce Microservices Application.

Each microservice will be packaged as an independent Docker image.

The React frontend will also be packaged as a separate Docker image.

Each image can be deployed independently in Kubernetes.

The containerization strategy follows cloud-native application development principles.

---

# 16.2 Objectives

The Docker implementation should achieve the following goals:

- Package each microservice independently.
- Provide identical runtime environments.
- Simplify deployment.
- Eliminate "works on my machine" issues.
- Support Kubernetes deployment.
- Reduce image size.
- Improve startup time.

---

# 16.3 Container Architecture

```

                 Docker Network

                        |

 ---------------------------------------------------------------

 |             |            |            |            |         |

Customer   Inventory    Payment    Notification   Order    React

Container  Container    Container   Container    Container Container

 ---------------------------------------------------------------

```

Each container runs one application.

One process per container.

---

# 16.4 Containers

The solution contains six containers.

| Container | Technology | Port |
|------------|------------|------|
| customer-api | ASP.NET Core | 5001 |
| inventory-api | ASP.NET Core | 5002 |
| payment-api | ASP.NET Core | 5003 |
| notification-api | ASP.NET Core | 5004 |
| order-api | ASP.NET Core | 5005 |
| web-ui | React + Nginx | 3000 |

---

# 16.5 Image Naming Convention

Docker images should follow a consistent naming convention.

Development

```

customer-api:dev

inventory-api:dev

payment-api:dev

notification-api:dev

order-api:dev

web-ui:dev

```

Production

```

customer-api:1.0.0

inventory-api:1.0.0

payment-api:1.0.0

notification-api:1.0.0

order-api:1.0.0

web-ui:1.0.0

```

Future

```

sumitraj/customer-api:v1

sumitraj/order-api:v1

```

Docker Hub or Azure Container Registry can host these images.

---

# 16.6 Multi-Stage Build

Every .NET API should use a multi-stage Docker build.

```

Restore

↓

Build

↓

Publish

↓

Runtime Image

```

Advantages

- Smaller image
- Faster deployment
- Reduced attack surface
- Faster image pull

---

# 16.7 Dockerfile Strategy

Each ASP.NET Core API contains its own Dockerfile.

Example

```

Customer.Api

Dockerfile

Inventory.Api

Dockerfile

Payment.Api

Dockerfile

Notification.Api

Dockerfile

Order.Api

Dockerfile

WebUI

Dockerfile

```

This allows every service to be built independently.

---

# 16.8 Runtime Environment

Current

```

Windows

↓

dotnet run

```

Future

```

Docker Container

↓

ASP.NET Runtime

```

Container OS

Linux

Base Image

Microsoft ASP.NET Runtime

---

# 16.9 Build Process

Developer

↓

Git Clone

↓

dotnet build

↓

Docker Build

↓

Docker Image

↓

Docker Run

↓

Container

---

# 16.10 Networking

All containers communicate through a Docker bridge network.

```

customer-api

↓

inventory-api

↓

payment-api

↓

notification-api

↓

order-api

↓

web-ui

```

Instead of localhost, containers communicate using service names.

Example

Instead of

```

http://localhost:5001

```

Docker

```

http://customer-api

```

---

# 16.11 Environment Variables

Current

appsettings.json

Future

Environment Variables

```

CustomerApi

InventoryApi

PaymentApi

NotificationApi

```

The Order API should read downstream service URLs from environment variables.

Example

```

CustomerApi=http://customer-api

InventoryApi=http://inventory-api

```

No code changes should be required.

---

# 16.12 Docker Volumes

Current Version

No persistent storage.

Future

Volumes may be used for:

- SQL Server
- Logs
- Uploaded files

---

# 16.13 Container Startup Order

Recommended startup sequence

```

Customer API

↓

Inventory API

↓

Payment API

↓

Notification API

↓

Order API

↓

React UI

```

This ensures downstream services are available before the Order API starts processing requests.

---

# 16.14 Health Checks

Current Version

No health checks.

Future

Each container should expose a health endpoint.

Example

```

GET /health

```

Docker can periodically verify container health.

---

# 16.15 Logging

Current

Console logs.

Future

Container logs collected using:

- Docker Logs
- Fluent Bit
- Elasticsearch
- Grafana Loki

---

# 16.16 Security Considerations

Future Docker images should:

- Run as a non-root user.
- Use minimal runtime images.
- Avoid embedding secrets.
- Read configuration from environment variables.
- Use read-only file systems where possible.

---

# 16.17 Docker Compose (Future)

Development environments can use Docker Compose.

Example services

```

customer-api

inventory-api

payment-api

notification-api

order-api

web-ui

```

Compose responsibilities

- Create network
- Start containers
- Configure environment variables
- Map ports

---

# 16.18 Image Build Flow

```

Source Code

↓

dotnet restore

↓

dotnet build

↓

dotnet publish

↓

Docker Build

↓

Docker Image

↓

Docker Push

↓

Docker Registry

```

---

# 16.19 Image Registry

Supported registries

- Docker Hub
- Azure Container Registry
- GitHub Container Registry
- AWS ECR

Development

Docker Hub

Production

Azure Container Registry (recommended)

---

# 16.20 Future Enhancements

Future improvements include:

- Distroless Images
- Image Signing
- Vulnerability Scanning (Trivy)
- SBOM Generation
- Multi-Architecture Builds (AMD64/ARM64)
- Layer Caching
- Automatic Version Tagging
- GitHub Actions Integration
- Private Container Registry
- Image Retention Policies

---

# 16.21 Containerization Summary

| Component | Containerized | Runtime |
|------------|---------------|---------|
| Customer API | Yes | ASP.NET Core |
| Inventory API | Yes | ASP.NET Core |
| Payment API | Yes | ASP.NET Core |
| Notification API | Yes | ASP.NET Core |
| Order API | Yes | ASP.NET Core |
| React UI | Yes | Nginx |

All six components are designed to run independently and communicate over HTTP. This architecture prepares the application for deployment to Kubernetes without requiring changes to the application code.

# 17. Kubernetes Deployment Design

---

# 17.1 Overview

The E-Commerce Microservices Application is designed to run on Kubernetes as a cloud-native application.

Each microservice is deployed independently using a Kubernetes Deployment and exposed internally using a Kubernetes Service.

The React application is exposed externally through an Ingress Controller.

The architecture enables:

- Independent deployment
- Independent scaling
- High availability
- Self-healing
- Rolling updates
- Zero downtime deployments

---

# 17.2 Kubernetes Architecture

```

                           Internet

                               │

                               ▼

                    Kubernetes Ingress

                               │

                               ▼

                     React UI Service

                               │

                               ▼

                          React Pods

                               │

REST API Calls

                               │

                               ▼

                    Order Service (ClusterIP)

                               │

                               ▼

                         Order Pods

                               │

      ┌──────────────┬──────────────┬──────────────┐

      ▼              ▼              ▼              ▼

Customer Service Inventory Service Payment Service Notification Service

      │              │              │              │

      ▼              ▼              ▼              ▼

Customer Pods Inventory Pods Payment Pods Notification Pods

```

---

# 17.3 Namespace

Current

Default Namespace

Future

```

ecommerce

```

Benefits

- Resource Isolation
- Easy Management
- RBAC
- Monitoring

Example

```

kubectl create namespace ecommerce

```

---

# 17.4 Deployments

Each application has one Deployment.

| Deployment | Purpose |
|------------|----------|
| customer-deployment | Customer API |
| inventory-deployment | Inventory API |
| payment-deployment | Payment API |
| notification-deployment | Notification API |
| order-deployment | Order API |
| webui-deployment | React UI |

Responsibilities

- Create Pods
- Restart Failed Pods
- Rolling Updates
- Replica Management

---

# 17.5 Pods

Each Deployment manages Pods.

Example

```

customer-deployment

↓

customer-pod-abc123

customer-pod-def456

```

Every Pod contains exactly one container.

Example

```

Customer Pod

↓

Customer Container

↓

ASP.NET Runtime

↓

Customer API

```

---

# 17.6 Replica Strategy

Development

```

Customer API

1 Replica

Inventory API

1 Replica

Payment API

1 Replica

Notification API

1 Replica

Order API

1 Replica

React UI

1 Replica

```

Production Example

```

Customer API

3 Replicas

Inventory API

2 Replicas

Payment API

3 Replicas

Notification API

2 Replicas

Order API

4 Replicas

React UI

2 Replicas

```

---

# 17.7 Services

Every Deployment is exposed through a Kubernetes Service.

| Service | Type |
|----------|------|
| customer-service | ClusterIP |
| inventory-service | ClusterIP |
| payment-service | ClusterIP |
| notification-service | ClusterIP |
| order-service | ClusterIP |
| webui-service | ClusterIP |

Reason

Only the React application needs external access.

Internal services communicate using ClusterIP.

---

# 17.8 Pod Communication

Pods never communicate using Pod IP.

Pods communicate using Kubernetes DNS.

Example

Instead of

```

http://10.244.0.21

```

Use

```

http://customer-service

```

Inventory

```

http://inventory-service

```

Payment

```

http://payment-service

```

Notification

```

http://notification-service

```

Order

```

http://order-service

```

Advantages

- Pod recreation does not affect communication.
- Service IP remains stable.
- Load balancing happens automatically.

---

# 17.9 Order API Communication

Current (Local)

```

Customer

↓

http://localhost:5001

```

Kubernetes

```

Customer

↓

http://customer-service

```

Inventory

```

http://inventory-service

```

Payment

```

http://payment-service

```

Notification

```

http://notification-service

```

These URLs will be supplied using ConfigMaps.

---

# 17.10 ConfigMap

Purpose

Store non-sensitive configuration.

Example

```

CustomerApi=http://customer-service

InventoryApi=http://inventory-service

PaymentApi=http://payment-service

NotificationApi=http://notification-service

```

Benefits

- No code changes
- Easy environment switching
- Kubernetes-native configuration

---

# 17.11 Secrets

Purpose

Store sensitive values.

Current Version

No secrets required.

Future

- SQL Connection String
- JWT Secret
- API Keys
- SMTP Password
- Docker Registry Credentials

Stored using

```

Secret

```

Never stored inside Docker images.

---

# 17.12 Ingress

Only one Ingress is required.

```

Internet

↓

Ingress Controller

↓

React UI

↓

REST Calls

↓

Order API

↓

Other APIs

```

Benefits

- Single Entry Point
- SSL Termination
- URL Routing
- Load Balancing

---

# 17.13 DNS Resolution

Every Service automatically receives a DNS name.

Example

```

customer-service

inventory-service

payment-service

notification-service

order-service

```

Pods communicate using these names.

No hardcoded IP addresses.

---

# 17.14 Horizontal Pod Autoscaler (Future)

Current

Fixed replicas.

Future

```

CPU > 70%

↓

Increase Replicas

↓

CPU < 30%

↓

Decrease Replicas

```

Possible Example

```

Order API

2 Pods

↓

High Traffic

↓

6 Pods

↓

Traffic Reduced

↓

2 Pods

```

---

# 17.15 Resource Requests

Every Deployment should specify resource requests.

Example

CPU

```

100m

```

Memory

```

128Mi

```

Benefits

- Better Scheduling
- Predictable Performance

---

# 17.16 Resource Limits

Every container should have limits.

CPU

```

500m

```

Memory

```

512Mi

```

Benefits

- Prevent noisy neighbors
- Prevent resource starvation

---

# 17.17 Liveness Probe

Purpose

Determine whether a Pod is healthy.

Future Endpoint

```

GET /health

```

If probe fails repeatedly

↓

Kubernetes restarts the Pod.

---

# 17.18 Readiness Probe

Purpose

Determine whether a Pod is ready to receive traffic.

Flow

```

Pod Starts

↓

Application Loads

↓

Readiness Probe Success

↓

Traffic Begins

```

If probe fails

↓

Service stops routing traffic to that Pod.

---

# 17.19 Rolling Updates

Deployment Strategy

```

Old Pod

↓

New Pod Created

↓

Readiness Check

↓

Traffic Shifted

↓

Old Pod Deleted

```

Advantages

- Zero Downtime
- Safe Deployment

---

# 17.20 Rollback

If deployment fails

```

kubectl rollout undo deployment order-deployment

```

Kubernetes restores the previous version.

---

# 17.21 Self-Healing

If a Pod crashes

```

Pod Crash

↓

Deployment detects failure

↓

New Pod Created

↓

Application Restored

```

Developer intervention is not required.

---

# 17.22 Logging

Current

```

kubectl logs pod-name

```

Future

```

Fluent Bit

↓

Elasticsearch

↓

Kibana

```

or

```

Grafana Loki

```

---

# 17.23 Monitoring

Future Stack

```

Prometheus

↓

Grafana

↓

AlertManager

```

Metrics

- CPU
- Memory
- Pod Restarts
- Response Time
- Error Rate

---

# 17.24 Deployment Order

Recommended Deployment Sequence

```

Namespace

↓

ConfigMap

↓

Secrets

↓

Customer API

↓

Inventory API

↓

Payment API

↓

Notification API

↓

Order API

↓

React UI

↓

Ingress

```

---

# 17.25 Future Kubernetes Architecture

```

                    Internet

                         │

                         ▼

                  NGINX Ingress

                         │

                         ▼

                 React UI Service

                         │

                         ▼

                    React Pods

                         │

                         ▼

                 Order Service

                         │

                         ▼

                    Order Pods

        ┌────────────┼────────────┬────────────┐

        ▼            ▼            ▼            ▼

 Customer      Inventory      Payment     Notification

 Service         Service       Service       Service

        ▼            ▼            ▼            ▼

 Customer Pods Inventory Pods Payment Pods Notification Pods

                         │

                         ▼

                    ConfigMap

                         │

                         ▼

                       Secrets

```

---

# 17.26 Kubernetes Resource Summary

| Resource | Count |
|----------|------:|
| Namespace | 1 |
| Deployments | 6 |
| Services | 6 |
| Pods | 6 (Development) |
| ConfigMaps | 1 |
| Secrets | 1 (Future) |
| Ingress | 1 |
| Horizontal Pod Autoscalers | 5 (Future) |

---

# 17.27 Design Principles

The Kubernetes deployment follows these principles:

- One container per Pod.
- One Deployment per microservice.
- One Service per Deployment.
- Internal communication through ClusterIP Services.
- External access only through Ingress.
- Configuration through ConfigMaps.
- Secrets managed using Kubernetes Secrets.
- Health monitored with Liveness and Readiness Probes.
- Horizontal scaling through HPA.
- Rolling updates with zero downtime.
- Self-healing managed by Kubernetes.

# 18. CI/CD Pipeline Design

---

# 18.1 Overview

This chapter describes the Continuous Integration and Continuous Deployment (CI/CD) strategy for the E-Commerce Microservices Application.

The objective is to automate:

- Build
- Test
- Docker Image Creation
- Security Scanning
- Image Publishing
- Kubernetes Deployment

The pipeline is designed to support multiple deployment environments while maintaining a consistent deployment process.

---

# 18.2 Objectives

The CI/CD pipeline should achieve the following:

- Automatically build code on every commit.
- Validate code quality.
- Run automated tests.
- Build Docker images.
- Push images to a container registry.
- Deploy to Kubernetes.
- Support rollback.
- Support multiple environments.

---

# 18.3 Development Workflow

```

Developer

↓

Feature Branch

↓

Pull Request

↓

Code Review

↓

Merge into Main

↓

GitHub Actions

↓

Docker Images

↓

Container Registry

↓

Kubernetes Deployment

```

---

# 18.4 Branching Strategy

Recommended Git Strategy

```

main

│

├── feature/customer-api

├── feature/order-api

├── feature/react-ui

├── feature/docker

├── feature/kubernetes

└── hotfix/payment

```

Rules

- Main branch always deployable.
- Feature branches for new development.
- Pull Request required before merge.
- Direct commits to main are discouraged.

---

# 18.5 CI Pipeline

Every push triggers

```

Git Push

↓

Restore Packages

↓

Build Solution

↓

Run Unit Tests

↓

Run Static Analysis

↓

Build Docker Images

↓

Security Scan

↓

Push Images

```

---

# 18.6 Build Pipeline

Step 1

```

Checkout Source

```

Step 2

```

Setup .NET SDK

```

Step 3

```

Restore Packages

```

Step 4

```

Build Solution

```

Step 5

```

Run Tests

```

Step 6

```

Publish Applications

```

---

# 18.7 Docker Build Stage

Each microservice builds independently.

```

Customer API

↓

Docker Build

↓

customer-api:1.0.0

```

Same process

Inventory API

↓

Payment API

↓

Notification API

↓

Order API

↓

React UI

---

# 18.8 Security Scanning

Every image should be scanned before publishing.

Recommended Tools

- Trivy
- Microsoft Defender
- Snyk
- Checkmarx
- Twistlock (Prisma Cloud)

Pipeline

```

Docker Image

↓

Security Scan

↓

Critical Vulnerability?

↓

YES

↓

Pipeline Failed

```

---

# 18.9 Image Publishing

Successful builds publish images.

Example

```

customer-api:1.0.0

↓

Docker Hub

```

Future

Azure Container Registry

GitHub Container Registry

Amazon ECR

---

# 18.10 CD Pipeline

Deployment Pipeline

```

Docker Image

↓

Kubernetes Manifest

↓

kubectl apply

↓

Deployment

↓

Rolling Update

↓

Health Check

↓

Deployment Complete

```

---

# 18.11 Deployment Environments

Recommended environments

| Environment | Purpose |
|-------------|---------|
| Development | Local development |
| SIT | System Integration Testing |
| UAT | User Acceptance Testing |
| Production | Live environment |

Each environment should use:

- Separate namespace
- Separate ConfigMap
- Separate Secrets
- Separate image tags

---

# 18.12 Configuration Management

Current

```

appsettings.json

```

Future

```

Environment Variables

↓

ConfigMaps

↓

Secrets

```

Application code should not contain environment-specific values.

---

# 18.13 Versioning Strategy

Semantic Versioning

```

Major.Minor.Patch

```

Examples

```

1.0.0

1.0.1

1.1.0

2.0.0

```

Docker Tag

```

customer-api:1.0.0

```

Git Tag

```

v1.0.0

```

---

# 18.14 Release Strategy

Recommended

Rolling Updates

```

Old Pods

↓

New Pods

↓

Readiness Check

↓

Traffic Shift

↓

Old Pods Removed

```

Benefits

- Zero downtime
- Safe deployment
- Easy rollback

---

# 18.15 Rollback Strategy

If deployment fails

```

kubectl rollout undo deployment order-deployment

```

Pipeline should automatically report:

- Failed deployment
- Rollback completed
- Current running version

---

# 18.16 Artifact Management

Pipeline Artifacts

- Published binaries
- Docker images
- Test reports
- Code coverage reports
- Security scan reports

Artifacts should be retained according to organizational policy.

---

# 18.17 Quality Gates

A deployment should proceed only if all quality gates pass.

Example quality gates:

- Build successful
- Unit tests pass
- Code analysis passes
- Security scan passes
- Docker build succeeds
- Image push succeeds

If any gate fails, deployment stops.

---

# 18.18 Monitoring After Deployment

After deployment, verify:

- Pods Running
- Services Available
- Readiness Probe Passed
- Liveness Probe Passed
- Application Logs Healthy

If any validation fails, investigate before promoting to the next environment.

---

# 18.19 Future Enhancements

The pipeline can be extended to include:

- Integration Tests
- UI Automation Tests
- Load Testing
- Blue-Green Deployment
- Canary Deployment
- GitOps (Argo CD / Flux)
- Automated Dependency Updates
- SBOM Generation
- Image Signing
- Policy Enforcement (OPA/Gatekeeper)

---

# 18.20 CI/CD Workflow Summary

```

Developer

↓

Git Push

↓

GitHub Actions

↓

Restore

↓

Build

↓

Unit Tests

↓

Security Scan

↓

Docker Build

↓

Docker Push

↓

Kubernetes Deployment

↓

Health Checks

↓

Application Available

```

---

# 18.21 Recommended GitHub Actions Workflows

Suggested workflow files:

```

.github

└── workflows

    ├── build.yml

    ├── test.yml

    ├── docker.yml

    ├── deploy-dev.yml

    ├── deploy-sit.yml

    ├── deploy-uat.yml

    └── deploy-prod.yml

```

Each workflow should have a single responsibility, making the pipeline easier to maintain and troubleshoot.

---

# 18.22 CI/CD Design Principles

The pipeline follows these principles:

- Automation first.
- Build once, deploy many.
- Immutable Docker images.
- Environment-specific configuration.
- Security integrated into the pipeline.
- Automated quality gates.
- Repeatable deployments.
- Rollback capability.
- Minimal manual intervention.
- Traceable releases through versioning and tags.

# 19. Development, Operations & Troubleshooting Guide

---

# 19.1 Overview

This chapter provides operational guidance for developers working on the E-Commerce Microservices application.

It covers:

- Local setup
- Development workflow
- Build process
- Running the application
- Debugging
- Logging
- Docker
- Kubernetes
- Git workflow
- Troubleshooting
- Best practices

---

# 19.2 Development Environment

Recommended Software

| Software | Version |
|-----------|---------|
| Windows | 11 |
| VS Code | Latest |
| .NET SDK | 9.x |
| Git | Latest |
| Docker Desktop | Latest |
| kubectl | Latest |
| Helm | Latest |
| k3d / Minikube | Latest |
| Node.js | 22 LTS |
| npm | Latest |

---

# 19.3 Solution Structure

```

Ecommerce

│

├── src

│   ├── Customer.Api

│   ├── Inventory.Api

│   ├── Payment.Api

│   ├── Notification.Api

│   ├── Order.Api

│   ├── Shared.Contracts

│   └── WebUI

│

├── docker

│

├── k8s

│

├── helm

│

├── .github

│

└── Ecommerce.sln

```

---

# 19.4 Clone Repository

```
git clone <repository-url>

cd Ecommerce
```

---

# 19.5 Restore Packages

```
dotnet restore
```

---

# 19.6 Build Solution

```
dotnet build Ecommerce.sln
```

Expected Result

```
Build succeeded.
```

---

# 19.7 Run APIs

Customer API

```
cd src/Customer.Api

dotnet run
```

Inventory API

```
cd src/Inventory.Api

dotnet run
```

Payment API

```
cd src/Payment.Api

dotnet run
```

Notification API

```
cd src/Notification.Api

dotnet run
```

Order API

```
cd src/Order.Api

dotnet run
```

---

# 19.8 Swagger URLs

| Service | URL |
|----------|-----|
| Customer | http://localhost:5001/swagger |
| Inventory | http://localhost:5002/swagger |
| Payment | http://localhost:5003/swagger |
| Notification | http://localhost:5004/swagger |
| Order | http://localhost:5005/swagger |

---

# 19.9 React Application

```
cd src/WebUI

npm install

npm run dev
```

Default URL

```
http://localhost:5173
```

---

# 19.10 Running Multiple APIs

Option 1

Open five terminals.

Run

```
dotnet run
```

inside each project.

---

Option 2

Visual Studio

Configure

```
Multiple Startup Projects
```

---

Option 3 (Recommended)

Docker Compose

Starts every service together.

---

Option 4 (Recommended Later)

Kubernetes

```
kubectl apply
```

starts all services.

---

# 19.11 Git Workflow

```

main

│

├── feature/customer

├── feature/payment

├── feature/react

├── feature/docker

└── feature/kubernetes

```

Recommended Workflow

```
git checkout -b feature/react-ui

git add .

git commit -m "feat: implement React dashboard"

git push

Create Pull Request

Merge to main
```

---

# 19.12 Commit Message Convention

Features

```
feat:
```

Bug Fix

```
fix:
```

Documentation

```
docs:
```

Refactoring

```
refactor:
```

Docker

```
docker:
```

Kubernetes

```
k8s:
```

Examples

```
feat: add customer api

feat: implement order orchestration

fix: resolve namespace conflict

docs: update architecture document

docker: add multi-stage Dockerfile

k8s: add order deployment
```

---

# 19.13 Logging

Current

```
ILogger
```

Output

```
Console

Terminal

Docker Logs

kubectl logs
```

Future

```
OpenTelemetry

Grafana

ELK

Loki
```

---

# 19.14 Debugging

Visual Studio Code

Press

```
F5
```

or

```
Run → Start Debugging
```

Breakpoints

Watch Window

Call Stack

Variables

Immediate Window

---

# 19.15 Common Build Errors

### Error

```
CS0118

'Order' is a namespace but is used like a type
```

Reason

Namespace conflicts.

Solution

```
using OrderModels = Order.Api.Models;
```

---

### Error

```
CS0104

Ambiguous Reference
```

Reason

Shared.Contracts and Models contain the same class name.

Solution

Use aliases.

Example

```
using PaymentContracts = Shared.Contracts.Payment;

using PaymentModels = Payment.Api.Models;
```

---

### Error

```
Connection Refused
```

Reason

Downstream API is not running.

Solution

Start the required API.

---

### Error

```
404 Not Found
```

Reason

Incorrect route.

Verify

```
Controller Route

Http Method

Swagger
```

---

### Error

```
500 Internal Server Error
```

Check

```
Terminal Logs

Stack Trace

Application Logs
```

---

# 19.16 Docker Troubleshooting

Image Build Failure

Check

```
Dockerfile

COPY commands

Project paths
```

Container Exit

Check

```
docker logs <container>
```

Running Containers

```
docker ps
```

Stopped Containers

```
docker ps -a
```

---

# 19.17 Kubernetes Troubleshooting

View Pods

```
kubectl get pods
```

View Services

```
kubectl get svc
```

View Deployments

```
kubectl get deployments
```

Describe Pod

```
kubectl describe pod <pod-name>
```

View Logs

```
kubectl logs <pod-name>
```

Restart Deployment

```
kubectl rollout restart deployment order-deployment
```

Rollback

```
kubectl rollout undo deployment order-deployment
```

---

# 19.18 Health Checks

Future Endpoint

```
GET /health
```

Used By

- Docker
- Kubernetes
- Monitoring Systems

---

# 19.19 Coding Standards

General

- One class per file.
- One public class per file.
- Meaningful class names.
- Meaningful method names.
- Dependency Injection.
- Constructor Injection.
- Async methods where applicable.
- Interfaces for services and repositories.
- Logging using ILogger.
- Avoid hardcoded values.

---

# 19.20 Best Practices

Architecture

- Controller contains no business logic.
- Service contains business logic.
- Repository contains data access.
- Shared contracts for inter-service communication.
- Strongly typed HttpClient.
- Configuration through appsettings.json or ConfigMaps.

Development

- Small commits.
- Frequent builds.
- Test every API.
- Validate Swagger after every change.
- Keep solution building successfully.

---

# 19.21 Current Limitations

Current Version

- In-memory storage.
- No Authentication.
- No Authorization.
- No SQL Server.
- No Message Broker.
- No Retry Policy.
- No Distributed Tracing.
- No Health Endpoint.
- No Unit Tests.
- No Integration Tests.

These are intentionally deferred to future iterations.

---

# 19.22 Future Roadmap

Phase 1

- Backend APIs ✅
- React UI
- Docker
- Kubernetes

---

Phase 2

- SQL Server
- Entity Framework Core
- JWT Authentication
- Refresh Tokens
- Role-Based Authorization

---

Phase 3

- RabbitMQ
- Saga Pattern
- Event-Driven Architecture
- Background Workers

---

Phase 4

- Redis
- Distributed Cache
- Health Checks
- OpenTelemetry
- Prometheus
- Grafana
- Helm
- GitHub Actions

---

# 19.23 Learning Objectives

By completing this project, the developer will gain practical experience in:

- ASP.NET Core Web API
- RESTful API Design
- Microservices Architecture
- Repository Pattern
- Dependency Injection
- HttpClient Factory
- Shared Contracts
- React
- Axios
- Docker
- Docker Compose
- Kubernetes
- Helm
- ConfigMaps
- Secrets
- Ingress
- CI/CD
- GitHub Actions
- Cloud-Native Development

---

# 19.24 Conclusion

This project is intentionally designed as a progressive learning platform.

Version 1 emphasizes understanding architecture, service communication, containerization, and Kubernetes deployment while keeping the business domain simple through in-memory data storage.

Future versions will incrementally introduce production-grade capabilities such as persistent storage, authentication, messaging, observability, and cloud deployment without requiring major architectural changes.

The design follows modern software engineering principles, making it an excellent foundation for learning full-stack development and cloud-native microservices.