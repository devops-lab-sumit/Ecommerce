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