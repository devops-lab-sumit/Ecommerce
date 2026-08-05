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