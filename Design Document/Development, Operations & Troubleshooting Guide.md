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