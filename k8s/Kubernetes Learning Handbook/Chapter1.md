Perfect. We'll build this as a proper handbook instead of a simple note.

---

# Kubernetes Learning Handbook

## Chapter 1 - Local Kubernetes Architecture (Part 1)

**Version:** 1.0

**Environment**

* Windows 10
* WSL2 (Ubuntu)
* Docker Engine (Installed inside WSL)
* K3D
* K3S
* Traefik Ingress Controller
* .NET Microservices
* Kubernetes

---

# 1. Objective

The objective of this setup is to simulate a real production Kubernetes environment on a local laptop.

Instead of deploying to AWS EKS, Azure AKS, or Google GKE, we deploy everything inside our laptop while keeping the architecture almost identical to production.

The major difference is only in the infrastructure provider.

---

# 2. Our Environment

Our application is **not** running directly on Windows.

It is running through several layers.

```text
Windows 10
│
├── WSL2 (Ubuntu)
│
├── Docker Engine
│
├── k3d Cluster
│
├── k3s Kubernetes Cluster
│
├── Worker Nodes
│
├── Pods
│
└── .NET Applications
```

So whenever we open

```
http://localhost:8080/api/products
```

our request travels through many components before reaching the application.

Understanding these layers is the key to understanding Kubernetes.

---

# 3. Complete Architecture

The complete architecture of our laptop looks like this.

```text
                    CLIENT

             Browser / Postman

                    │

                    ▼

          Windows Operating System
          (Host Machine)

                    │

      Windows Firewall (Inbound Rules)

                    │

      Windows Networking Stack

                    │

            WSL2 Integration

                    │

                    ▼

        Ubuntu (WSL Linux Machine)

                    │

          Docker Engine

                    │

        Docker Network

        ┌──────────────────────────────┐
        │                              │
        │                              │
        ▼                              ▼

k3d Server LB Container          k3d Cluster Container(s)

(Traefik Entry Point)            Control Plane
                                 Worker Nodes

                                 Kubernetes

                                 ┌──────────────┐

                                 │  Ingress     │

                                 └──────┬───────┘

                                        │

                                 ┌──────▼───────┐

                                 │   Service    │

                                 └──────┬───────┘

                                        │

                             ┌──────────┴──────────┐

                             │                     │

                         Customer Pod        Inventory Pod

```

This architecture is almost identical to an AWS EKS cluster.

---

# 4. Components

## Windows

Windows is only the host operating system.

Responsibilities:

* Running WSL
* Providing network access
* Providing firewall
* Exposing ports
* Running VS Code

Windows does **not** run Kubernetes.

---

## WSL

Inside Windows we installed Ubuntu using WSL2.

Think of it as a lightweight Linux VM.

Everything Kubernetes-related runs here.

Inside WSL we have

* Docker
* kubectl
* Helm
* K3D
* K3S

---

## Docker Engine

Docker Engine is installed inside Ubuntu.

Docker creates Linux containers.

When we create a K3D cluster, Docker creates multiple containers.

Example:

```bash
docker ps
```

Output

```
k3d-workload-ecommerce-server-0

k3d-workload-ecommerce-agent-0

k3d-workload-ecommerce-agent-1

k3d-workload-ecommerce-serverlb
```

Notice that every Kubernetes node is actually a Docker container.

---

## k3d

K3D is **not Kubernetes**.

K3D is a tool that creates Kubernetes clusters using Docker containers.

Think of it as

```
K3D
↓

Creates

↓

Docker Containers

↓

Runs K3S inside them
```

---

## K3S

K3S is the lightweight Kubernetes distribution.

This is the actual Kubernetes cluster.

Inside K3S we have

* API Server
* Scheduler
* Controller Manager
* CoreDNS
* kube-proxy
* Pods
* Services
* Deployments
* ReplicaSets

Everything we learn about Kubernetes is happening inside K3S.

---

# 5. Why are there multiple Docker containers?

When we executed

```bash
k3d cluster create workload-ecommerce \
--servers 1 \
--agents 2
```

K3D created

```
1 Server Node

2 Worker Nodes

1 Load Balancer
```

Result

```
Docker Containers

----------------------------------------

Server Node

Worker Node 1

Worker Node 2

Load Balancer

----------------------------------------
```

These are four separate Linux containers.

---

# 6. Kubernetes Node Architecture

Inside the Server Node

```
API Server

Scheduler

Controller Manager

etcd

CoreDNS
```

Inside Worker Node

```
kubelet

containerd

kube-proxy

Pods
```

The worker node is where our application actually runs.

---

# 7. Where is our Application Running?

Our Customer API is **not** running inside Docker directly.

It is running like this.

```
Docker Container

↓

Worker Node

↓

Kubernetes Pod

↓

.NET Application
```

So the hierarchy is

```
Docker

↓

Kubernetes Node

↓

Pod

↓

Container

↓

.NET Application
```

This is why Kubernetes is often described as an orchestration layer above containers—it schedules and manages application containers inside pods, while the node itself is implemented as a Docker container in a local k3d setup.

---

# Chapter 1 Summary

At this point we have established:

* Windows is the host operating system.
* WSL provides a Linux environment.
* Docker runs inside WSL.
* K3D creates Docker containers.
* K3S runs Kubernetes inside those containers.
* Worker nodes host our application pods.
* Our .NET APIs run inside Kubernetes Pods, which run on Worker Nodes.

---

In **Chapter 1 (Part 2)**, we'll cover:

* Why `k3d-serverlb` exists.
* How Traefik fits into the architecture.
* The complete request flow from browser to pod.
* Why the Kubernetes API Server is **not** in the data path for application requests.
* How the port mappings (`8080→80`, `8443→443`, `6443→6443`) work and what each one is used for.
