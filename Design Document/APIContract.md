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