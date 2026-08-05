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