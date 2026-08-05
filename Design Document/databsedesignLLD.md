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