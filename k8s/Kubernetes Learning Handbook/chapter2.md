# Kubernetes Learning Handbook

# Chapter 2 - Networking, Load Balancer, Ingress & Request Flow (Part 2)

---

# 8. Why did K3D create one more container called `serverlb`?

When you executed

```bash
k3d cluster create workload-ecommerce \
  --servers 1 \
  --agents 2 \
  -p "8080:80@loadbalancer" \
  -p "8443:443@loadbalancer"
```

K3D automatically created one additional container.

```
k3d-workload-ecommerce-serverlb
```

Many beginners think this is another Kubernetes node.

It is **NOT**.

It is simply a **Docker container** acting as a load balancer in front of the Kubernetes cluster.

---

## Why is it required?

Imagine you have

```
Worker Node 1

Worker Node 2

Worker Node 3
```

Which worker should receive the request?

Windows doesn't know.

Docker doesn't know.

The client doesn't know.

Therefore K3D creates one entry point.

```
                Client

                   │

                   ▼

        k3d Server Load Balancer

                   │

         Kubernetes Cluster
```

Instead of exposing every node individually, only one component is exposed.

---

# 9. What is inside serverlb?

Many people assume Kubernetes created this.

Actually no.

The serverlb container contains

```
nginx

or

Traefik Entry Proxy
```

depending on the K3D version.

Its job is only forwarding TCP traffic.

It is **not** your Kubernetes Ingress Controller.

This is one of the biggest confusions beginners have.

---

There are actually **two load balancers** in our setup.

```
Docker Load Balancer

↓

Traefik Ingress Controller
```

These are different components.

---

# 10. Difference Between ServerLB and Traefik

| ServerLB              | Traefik              |
| --------------------- | -------------------- |
| Docker Container      | Kubernetes Pod       |
| Created by K3D        | Created by K3S       |
| Outside Kubernetes    | Inside Kubernetes    |
| Receives host traffic | Routes HTTP requests |
| Works at TCP level    | Works at HTTP level  |

This distinction is very important.

---

# 11. Where is Traefik Running?

Let's see.

```
Windows

↓

Ubuntu

↓

Docker

↓

ServerLB Container

↓

Kubernetes Cluster

↓

Traefik Pod

↓

Service

↓

Application
```

Traefik itself is running **inside Kubernetes**.

You can verify this.

```bash
kubectl get pods -A
```

You'll see something similar to

```
kube-system

traefik-xxxxx
```

That means Traefik is just another Kubernetes Pod.

---

# 12. Complete Request Flow

Suppose we open

```
http://localhost:8080/api/customers
```

Let's see every hop.

---

## Step 1

Browser sends request

```
GET

localhost:8080
```

↓

Windows Networking

---

## Step 2

Windows checks

```
Port 8080
```

Windows sees

```
Forward this port to WSL
```

because WSL automatically exposed localhost.

---

## Step 3

Request enters Ubuntu

```
Ubuntu

↓

Port 8080
```

---

## Step 4

Docker sees

```
8080 → 80
```

because while creating cluster we executed

```
-p 8080:80@loadbalancer
```

So Docker forwards

```
Host 8080

↓

Container Port 80
```

---

## Step 5

Now request reaches

```
k3d-serverlb
```

This container knows

```
Forward request to Kubernetes
```

---

## Step 6

Request enters Kubernetes

Now it reaches

```
Traefik
```

NOT API Server.

This is an extremely important point.

---

# 13. Does Application Traffic Go Through API Server?

Many beginners think

```
Browser

↓

API Server

↓

Pod
```

This is **WRONG**.

The API Server is **not** in the application request path.

Correct architecture

```
Browser

↓

ServerLB

↓

Traefik

↓

Service

↓

Pod
```

The API Server is completely separate.

---

# 14. Then what is API Server used for?

The API Server only handles Kubernetes management requests.

Examples

```
kubectl get pods

kubectl apply

kubectl delete

kubectl describe

kubectl logs

kubectl rollout restart
```

These commands go here

```
kubectl

↓

6443

↓

API Server
```

Your application traffic never reaches the API Server.

---

# 15. Two Different Types of Traffic

There are two completely different network paths.

## Control Plane Traffic

```
kubectl

↓

6443

↓

API Server
```

Purpose

Managing Kubernetes.

---

## Application Traffic

```
Browser

↓

8080

↓

ServerLB

↓

Traefik

↓

Service

↓

Pod
```

Purpose

Serving users.

These two paths never mix.

---

# 16. Why did we expose Port 6443?

Docker showed

```
45849 -> 6443
```

This is automatically created.

Purpose

```
kubectl

↓

45849

↓

6443

↓

API Server
```

Without this mapping

```
kubectl get pods
```

would never work.

---

# 17. Why did we expose Port 8080?

Because browsers cannot access

```
Container Port 80
```

directly.

We mapped

```
Host 8080

↓

Container 80
```

using

```bash
-p 8080:80@loadbalancer
```

---

# 18. Why Port 8443?

Exactly same concept.

```
Host 8443

↓

Container 443
```

Used for HTTPS.

---

# 19. Why did Docker show

```
0.0.0.0:8080

AND

[::]:8080
```

This confused you earlier.

These are not duplicate mappings.

```
0.0.0.0

↓

IPv4
```

and

```
[::]

↓

IPv6
```

Docker listens on both protocols so clients using either IPv4 or IPv6 can connect.

---

# 20. Why localhost Worked But Mobile Didn't

Initially

```
localhost

✓ Working
```

because WSL automatically forwarded localhost.

But

```
192.168.x.x

✗ Failed
```

because Windows only exposed

```
127.0.0.1
```

The request from another device never reached WSL.

That is why you saw

```
Connection Refused
```

---

# 21. What Was the Problem?

Running

```cmd
netstat -ano | findstr :8080
```

showed

```
127.0.0.1:8080
```

Notice

```
127.0.0.1
```

instead of

```
192.168.x.x
```

This proved the service was listening only on the loopback interface.

---

# 22. Why Did We Configure `netsh portproxy`?

We added a Windows port proxy rule:

```cmd
netsh interface portproxy add v4tov4 ^
listenaddress=192.168.29.229 ^
listenport=8080 ^
connectaddress=172.18.95.190 ^
connectport=8080
```

This created an additional forwarding step:

```
Mobile

↓

192.168.29.229:8080

↓

Windows Port Proxy

↓

172.18.95.190:8080 (WSL)

↓

Docker ServerLB

↓

Traefik

↓

Service

↓

Pod
```

After adding this rule, a test like:

```cmd
curl http://192.168.29.229:8080/api/customers
```

worked successfully from Windows using the LAN IP, confirming that Windows could now forward traffic into WSL.

---

## Chapter 2 Summary

You should now understand:

* Why `k3d-serverlb` exists.
* The difference between the Docker load balancer and the Traefik Ingress Controller.
* Why application traffic does **not** go through the Kubernetes API Server.
* The separate control-plane (`kubectl → API Server`) and data-plane (`Browser → Ingress → Service → Pod`) paths.
* Why ports `8080`, `8443`, and `6443` are mapped.
* Why Docker shows both IPv4 (`0.0.0.0`) and IPv6 (`[::]`) listeners.
* Why `localhost` worked but the LAN IP initially failed.
* How `netsh interface portproxy` allowed other devices on your network to reach the application running inside WSL and k3d.

In **Chapter 3**, we'll cover:

* The Windows Firewall configuration you created.
* The exact troubleshooting steps we followed (including `netstat`, `curl`, `ss`, `hostname -I`, and `portproxy`).
* Why each diagnostic command was used.
* A comparison of this local networking setup with how AWS EKS, Azure AKS, and production Kubernetes clusters expose applications using cloud load balancers.


# Kubernetes Learning Handbook

# Chapter 3 – Windows Networking, Firewall, Troubleshooting & Production Mapping (Part 3)

---

# 23. The Biggest Problem We Faced

After creating:

* Cluster
* Deployment
* Service
* Ingress

everything worked.

From Ubuntu

```bash
curl http://localhost:8080/api/customers
```

worked.

From Windows

```cmd
curl http://localhost:8080/api/customers
```

also worked.

But

```text
Mobile Phone

↓

http://192.168.29.229:8080/api/customers
```

did NOT work.

Instead we got

```text
ERR_CONNECTION_REFUSED
```

At this point we started debugging.

This is exactly how debugging happens in a production company.

---

# 24. Our Debugging Philosophy

Instead of randomly changing configurations, we debugged layer by layer.

Always follow this sequence.

```text
Client

↓

Operating System

↓

Virtual Machine

↓

Container Runtime

↓

Load Balancer

↓

Ingress

↓

Service

↓

Pod

↓

Application
```

Never skip layers.

---

# 25. Step 1 – Verify the Application

First verify that the application itself is healthy.

```bash
kubectl get pods
```

Output

```text
customer-api

Running

inventory-api

Running
```

If Pod is not Running

↓

Don't debug networking.

First fix the Pod.

---

# Step 2 – Verify Service

```bash
kubectl get svc
```

Check

* ClusterIP

* Port

* Target Port

Example

```text
customer-api-service

80 → 8080
```

If Service is incorrect

↓

Ingress will never work.

---

# Step 3 – Verify Endpoints

```bash
kubectl describe service customer-api-service
```

Expected

```text
Endpoints

10.42.0.12:8080

10.42.1.20:8080
```

If Endpoints are

```text
<none>
```

Then

Service selector is wrong.

OR

Pods don't have matching labels.

---

# Step 4 – Verify Ingress

```bash
kubectl get ingress
```

Then

```bash
kubectl describe ingress ecommerce-ingress
```

Check

Rules

Backend

Ports

Addresses

---

# Step 5 – Test Inside Cluster

Create BusyBox

```bash
kubectl run test-client \
--rm -it \
--image=busybox \
-- sh
```

Inside BusyBox

```bash
wget -qO- http://customer-api-service/api/customers
```

If this works

↓

Pod

↓

Service

↓

CoreDNS

↓

Ingress are all healthy.

The issue is outside Kubernetes.

---

# Step 6 – Test Ubuntu

Inside WSL

```bash
curl http://localhost:8080/api/customers
```

Worked.

Meaning

Docker

↓

Load Balancer

↓

Ingress

↓

Everything is healthy.

---

# Step 7 – Test Windows

Windows CMD

```cmd
curl http://localhost:8080/api/customers
```

Worked.

Meaning

Windows

↓

WSL localhost forwarding

works.

---

# Step 8 – Test LAN IP

Now

```cmd
curl http://192.168.29.229:8080/api/customers
```

Failed.

This is where we realised

Kubernetes is NOT the problem.

---

# 26. Commands We Used

## Find Windows IP

```cmd
ipconfig
```

Output

```text
IPv4

192.168.29.229
```

This is the IP mobile phones should use.

---

## Check Docker Containers

```bash
docker ps
```

Expected

```text
server-0

agent-0

agent-1

serverlb
```

---

## Check Port Mapping

```bash
docker port k3d-workload-ecommerce-serverlb
```

Expected

```text
80/tcp

↓

8080

443/tcp

↓

8443
```

---

## Check Listening Ports (Windows)

```cmd
netstat -ano | findstr :8080
```

Output

Initially

```text
127.0.0.1:8080
```

This immediately explained

Only localhost can connect.

---

## Check Listening Ports (Ubuntu)

```bash
ss -tlnp | grep 8080
```

Output

```text
0.0.0.0:8080
```

Meaning

Inside Ubuntu

Everything was exposed correctly.

---

## Find WSL IP

```bash
hostname -I
```

Output

```text
172.18.95.190
```

This became very important.

---

# 27. Windows Firewall

We also verified Windows Firewall.

Open

```text
Windows Defender Firewall

↓

Advanced Security

↓

Inbound Rules
```

Created Rule

```text
TCP

8080

Allow Connection
```

Profiles

```text
Private

Domain
```

Name

```text
K3D 8080
```

Firewall was NOT the issue.

---

# 28. The Real Problem

Windows automatically forwards

```text
localhost

↓

WSL
```

But Windows does NOT automatically forward

```text
192.168.x.x

↓

WSL
```

on Windows 10.

That was our issue.

---

# 29. Windows Port Proxy

We solved it using

```cmd
netsh interface portproxy
```

Rule

```cmd
netsh interface portproxy add v4tov4 ^
listenaddress=192.168.29.229 ^
listenport=8080 ^
connectaddress=172.18.95.190 ^
connectport=8080
```

Now request became

```text
Mobile

↓

192.168.29.229

↓

Windows Port Proxy

↓

172.18.95.190

↓

Ubuntu

↓

Docker

↓

ServerLB

↓

Traefik

↓

Ingress

↓

Service

↓

Pod
```

After this

```cmd
curl http://192.168.29.229:8080/api/customers
```

worked.

---

# 30. Important Limitation

The WSL IP

```text
172.18.95.190
```

is NOT permanent.

After

```text
Restart

Shutdown

Reboot

wsl --shutdown
```

the IP may become

```text
172.22.x.x
```

In that case

Delete

```cmd
netsh interface portproxy delete v4tov4 listenaddress=192.168.29.229 listenport=8080
```

Then create a new rule using the new WSL IP.

---

# 31. Production Architecture (AWS EKS)

Our local setup:

```text
Phone
   │
Windows
   │
WSL
   │
Docker
   │
k3d ServerLB
   │
Traefik
   │
Ingress
   │
Service
   │
Pods
```

Production setup:

```text
Internet
   │
DNS
(api.company.com)
   │
AWS Application Load Balancer (ALB)
   │
AWS VPC
   │
EKS Worker Nodes
   │
Traefik / NGINX / Istio Ingress Gateway
   │
Ingress
   │
Service
   │
Pods
```

Notice the similarities.

---

# 32. Local vs Production

| Local Laptop       | Production (AWS EKS)            |
| ------------------ | ------------------------------- |
| Windows            | Internet Client                 |
| Windows Firewall   | AWS Security Group              |
| Windows Port Proxy | AWS ALB Listener                |
| WSL Ubuntu         | Amazon Linux EC2                |
| Docker Network     | AWS VPC                         |
| k3d ServerLB       | AWS ALB / NLB                   |
| Traefik            | Traefik / NGINX / Istio Gateway |
| Ingress            | Ingress                         |
| Service            | Service                         |
| Pods               | Pods                            |

The concepts remain the same; only the infrastructure changes.

---

# 33. What We Learned from This Lab

This lab was **not just about Kubernetes**. It also covered operating system and networking fundamentals.

You learned:

* Kubernetes application deployment (Deployment → ReplicaSet → Pod).
* Service discovery with ClusterIP Services.
* Ingress routing using Traefik.
* Host port mapping with k3d.
* Windows Firewall configuration.
* WSL networking behavior.
* Docker networking.
* Windows Port Proxy.
* Layer-by-layer debugging.

These are practical skills you'll use in real projects.

---

# 34. Enterprise Troubleshooting Checklist

Whenever an application is not accessible, check in this order:

1. Is the Pod running?

   ```bash
   kubectl get pods
   ```

2. Is the application healthy inside the Pod?

   ```bash
   kubectl logs <pod-name>
   kubectl exec -it <pod-name> -- sh
   ```

3. Does the Service have endpoints?

   ```bash
   kubectl describe svc <service-name>
   ```

4. Can another Pod access the Service?

   ```bash
   kubectl run test-client --rm -it --image=busybox -- sh
   wget -qO- http://<service-name>
   ```

5. Is the Ingress configured correctly?

   ```bash
   kubectl describe ingress
   ```

6. Is the Ingress Controller running?

   ```bash
   kubectl get pods -n kube-system
   ```

7. Are host ports exposed correctly?

   ```bash
   docker ps
   docker port <serverlb-container>
   ```

8. Is the operating system listening on the expected port?

   ```cmd
   netstat -ano | findstr :8080
   ```

9. Is the firewall allowing inbound traffic?

10. Is there any OS-level networking (such as WSL or cloud networking) preventing access?

---

## End of Part 3

At this point, your handbook covers:

* Local Kubernetes architecture.
* Request flow from client to Pod.
* Control Plane vs Data Plane.
* Networking layers.
* Ingress.
* Windows and WSL networking.
* Troubleshooting methodology.
* Mapping the local lab to a production EKS environment.

The next chapter will naturally transition into **Host-Based Routing**, where you'll configure multiple domains (for example, `customer.local` and `inventory.local`) to route to different services through the same Ingress, just like production systems using domains such as `api.company.com` and `inventory.company.com`.


# Kubernetes Learning Handbook

# Chapter 4 – Kubernetes Request Flow, Production Architecture & Mental Model (Part 4)

> **Goal of this chapter**
>
> By the end of this chapter, you should be able to draw the complete architecture of both your **local k3d cluster** and a **real AWS EKS production environment** from memory.

---

# 35. The Complete Request Journey

Let's trace a request from your mobile phone to your .NET API.

This is the complete flow.

```text
Mobile Phone

↓

Wi-Fi Router

↓

Windows Machine
(192.168.29.229)

↓

Windows Firewall

↓

Windows Port Proxy

↓

WSL Ubuntu

↓

Docker Engine

↓

k3d Server Load Balancer Container

↓

Traefik Ingress Controller

↓

Ingress Resource

↓

ClusterIP Service

↓

Pod

↓

.NET API

↓

Controller

↓

Business Logic

↓

Database (Future)
```

This is the exact path your request followed.

---

# 36. Understanding Each Layer

Think of every layer as having only **one responsibility**.

---

## Layer 1 – Client

Examples

* Mobile App
* React UI
* Browser
* Postman

Its responsibility is simple.

```text
Send HTTP Request
```

Example

```http
GET /api/customers
```

It doesn't know Kubernetes.

It doesn't know Pods.

It doesn't know Services.

---

## Layer 2 – Network

The network's responsibility is

```text
Deliver packets
```

It simply forwards traffic from one machine to another.

Examples

* Wi-Fi
* Ethernet
* Internet

---

## Layer 3 – Operating System

Windows receives the packet.

Responsibilities:

* Firewall
* Routing
* TCP/IP stack

Windows decides

```text
Should this packet be accepted?
```

If firewall blocks it

↓

Request ends here.

---

## Layer 4 – WSL

Windows forwards

```text
localhost
```

to

```text
Ubuntu
```

In Windows 10

LAN traffic wasn't forwarded.

That is why we configured

```text
Windows Port Proxy
```

---

## Layer 5 – Docker

Docker knows

```text
8080

↓

Container Port 80
```

This is NOT Kubernetes.

This is Docker networking.

---

## Layer 6 – k3d Server Load Balancer

This is the first Kubernetes-related networking component.

Responsibilities

```text
Receive traffic

↓

Forward to Kubernetes
```

It does NOT know

* Customer API
* Inventory API

It only knows

```text
Forward to cluster
```

---

## Layer 7 – Traefik

Traefik understands HTTP.

Now the request looks like

```http
GET

/api/customers
```

Traefik checks

```yaml
rules:

path:

/api/customers
```

Then decides

```text
Customer Service
```

---

## Layer 8 – Ingress Resource

Ingress itself doesn't forward traffic.

Ingress is only

```text
Configuration
```

Example

```yaml
Path

↓

Service
```

Traefik reads this configuration.

---

## Layer 9 – Service

Service responsibilities

* Stable Endpoint
* Load Balancing
* Service Discovery

Service decides

```text
Customer Pod A

OR

Customer Pod B
```

---

## Layer 10 – Pod

Pod runs

```text
.NET Container
```

The application processes

```http
GET

/api/customers
```

and returns

```json
[
 {
   "id":1,
   "name":"John"
 }
]
```

---

# 37. What Every Layer Knows

This is very important.

Every layer knows only a little.

| Layer    | Knows About            |
| -------- | ---------------------- |
| Browser  | URL                    |
| Windows  | TCP Port               |
| Docker   | Port Mapping           |
| ServerLB | Kubernetes Entry Point |
| Traefik  | HTTP Rules             |
| Ingress  | Routing Configuration  |
| Service  | Pod Endpoints          |
| Pod      | Application            |

Notice

Nobody knows everything.

Each component has only one responsibility.

This is one of the biggest design principles of Kubernetes.

---

# 38. Why Kubernetes Uses So Many Components

Many beginners ask

> Why not send traffic directly to Pod?

Because Pods change.

Example

```text
Pod A

10.42.0.15
```

Crash

↓

New Pod

```text
10.42.1.8
```

If clients directly connected to Pods

Every restart

↓

Everything breaks.

Therefore

```text
Pod

↓

Service

↓

Ingress

↓

Client
```

creates stable communication.

---

# 39. Compare Local vs Production

Let's compare every layer.

## Local Laptop

```text
Mobile

↓

Windows

↓

WSL

↓

Docker

↓

ServerLB

↓

Traefik

↓

Ingress

↓

Service

↓

Pod
```

---

## AWS Production

```text
User

↓

Internet

↓

DNS

↓

Application Load Balancer

↓

EC2 Worker Nodes

↓

Traefik

↓

Ingress

↓

Service

↓

Pod
```

Exactly the same concept.

Only infrastructure changes.

---

# 40. Why We Needed Windows Port Proxy

This is one of the biggest lessons.

The problem had nothing to do with Kubernetes.

The problem existed

BEFORE

request reached Kubernetes.

Flow

```text
Phone

↓

Windows

✗

WSL

↓

Docker

↓

Kubernetes
```

Request never entered Kubernetes.

Therefore

Changing

* Deployment
* Service
* Ingress

would never solve it.

---

# 41. Production Equivalent

Let's compare.

## Local

```text
Windows Firewall
```

Production

```text
AWS Security Group
```

---

Local

```text
Windows Port Proxy
```

Production

```text
AWS ALB Listener
```

---

Local

```text
Docker Network
```

Production

```text
AWS VPC
```

---

Local

```text
WSL
```

Production

```text
Amazon Linux EC2
```

---

Local

```text
ServerLB
```

Production

```text
AWS Application Load Balancer
```

---

# 42. Does Production Use Port Proxy?

No.

AWS already provides networking.

Instead of

```text
Windows

↓

Port Proxy
```

you have

```text
Internet

↓

ALB

↓

Target Group

↓

EC2
```

AWS performs all routing.

You don't configure

```cmd
netsh
```

inside AWS.

---

# 43. Production Request Flow

Suppose user opens

```text
https://api.company.com/customers
```

Flow

```text
Browser

↓

DNS

↓

Public IP

↓

Application Load Balancer

↓

Target Group

↓

Worker Node

↓

Ingress Controller

↓

Ingress Rule

↓

Customer Service

↓

Customer Pod
```

Notice

No API Server.

Exactly like our laptop.

---

# 44. Control Plane vs Data Plane

This is an interview favourite.

## Control Plane

Used by administrators.

Examples

```bash
kubectl apply

kubectl get

kubectl logs

kubectl rollout
```

Flow

```text
kubectl

↓

API Server

↓

Scheduler

↓

Controller Manager

↓

Worker Node
```

---

## Data Plane

Used by users.

Example

```text
GET /api/customers
```

Flow

```text
Browser

↓

Load Balancer

↓

Ingress

↓

Service

↓

Pod
```

The API Server is **never involved** in serving application requests.

---

# 45. Mental Model

Whenever you see Kubernetes,

don't think

```text
Pod
```

Think

```text
Client

↓

Networking

↓

Load Balancer

↓

Ingress

↓

Service

↓

Pod
```

Whenever debugging,

start from the top.

Never start from the Pod.

---

# 46. Interview Questions You Can Now Answer

### Q1. Why doesn't application traffic go through the Kubernetes API Server?

Because the API Server belongs to the **control plane**. It manages Kubernetes resources but does not serve application traffic. User requests go through the load balancer, ingress controller, service, and finally the pod.

---

### Q2. Why do we need a Service if Pods already have IPs?

Pods are ephemeral—their IP addresses change when they are recreated. A Service provides a stable virtual IP and DNS name and can distribute traffic across multiple pod replicas.

---

### Q3. Why do we need Ingress if we already have a Service?

A Service exposes a single application. An Ingress provides HTTP/HTTPS routing for multiple services using paths or hostnames and lets you expose many services through a single external entry point.

---

### Q4. Why was Windows Port Proxy required in our lab?

Windows 10 forwarded `localhost` traffic to WSL but did not automatically forward traffic arriving on the LAN IP (`192.168.x.x`) into WSL. The port proxy bridged Windows networking to the WSL IP.

---

### Q5. What replaces `k3d-serverlb` in AWS?

Typically:

* AWS Application Load Balancer (ALB) for HTTP/HTTPS applications.
* AWS Network Load Balancer (NLB) for TCP/UDP or very high-performance networking.

These are AWS-managed services outside the Kubernetes cluster.

---

# End of Chapter 4

You now have a complete mental model of how a request travels from a client to your application, how each networking layer contributes, how your local environment maps to production, and why Kubernetes separates control-plane operations from application traffic.

---

## Next Chapter

**Chapter 5 – Host-Based Routing with Ingress**

We'll configure multiple domains such as:

* `customer.local`
* `inventory.local`
* `order.local`

all using the same Ingress Controller and the same external IP, exactly like enterprise environments with domains such as:

* `customer.company.com`
* `inventory.company.com`
* `orders.company.com`

This will complete your understanding of the two primary Ingress routing strategies: **path-based** and **host-based** routing.
