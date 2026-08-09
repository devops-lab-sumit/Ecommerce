Perfect. This is exactly the right time to start Ingress.

You've already understood:

* ✅ Pod
* ✅ ReplicaSet
* ✅ Deployment
* ✅ Service (ClusterIP, NodePort, LoadBalancer)
* ✅ DNS
* ✅ Service Discovery
* ✅ Pod-to-Pod communication
* ✅ Cross-namespace communication

Now you're going to understand **how external users reach your services**.

---

# Before writing any YAML, let's understand the problem.

Suppose you deploy your complete e-commerce application.

```
Cluster

Customer API Service (ClusterIP)
Inventory API Service (ClusterIP)
Order API Service (ClusterIP)
Payment API Service (ClusterIP)
Notification API Service (ClusterIP)
Frontend Service (ClusterIP)
```

Now imagine a browser opens

```
https://myshop.com
```

How does Kubernetes know whether to send the request to:

* Customer API?
* Inventory API?
* Order API?
* UI?

It doesn't.

---

## First wrong approach

Make every service LoadBalancer.

```
Customer API
    │
LoadBalancer

Inventory API
    │
LoadBalancer

Order API
    │
LoadBalancer

Payment API
    │
LoadBalancer

Frontend
    │
LoadBalancer
```

Problem?

You now have **5 cloud load balancers**.

In AWS, Azure, GCP...

that means

* five public IPs
* five DNS names
* five bills

Nobody does this in production.

---

## Better approach

Create ONE Load Balancer.

```
Internet
      │
      ▼
LoadBalancer
```

Now another question appears.

The LoadBalancer receives

```
GET /
```

How does it know where to send it?

Customer?

Inventory?

Order?

It doesn't.

So we need another component.

---

# That component is Ingress.

```
Internet
      │
      ▼
LoadBalancer
      │
      ▼
Ingress Controller
      │
      ├──────────────► Frontend Service
      │
      ├──────────────► Customer Service
      │
      ├──────────────► Inventory Service
      │
      ├──────────────► Order Service
      │
      └──────────────► Payment Service
```

Notice something.

The Ingress **doesn't talk to Pods.**

It talks to **Services**.

Exactly like your Customer API talks to Inventory Service.

---

# Think of Ingress as a Router.

It simply reads rules.

Example:

```
URL
```

```
https://myshop.com
```

↓

```
Frontend Service
```

---

```
https://myshop.com/api/customers
```

↓

```
Customer Service
```

---

```
https://myshop.com/api/orders
```

↓

```
Order Service
```

---

```
https://myshop.com/api/products
```

↓

```
Inventory Service
```

That's all an Ingress does.

It is an HTTP router.

---

# Very Important

Many beginners think Ingress is a Pod.

**No.**

Ingress itself is **just a Kubernetes resource**, just like:

* Deployment
* Service
* ConfigMap

Example:

```
kind: Ingress
```

That's only configuration.

Someone has to actually process that configuration.

---

That "someone" is called the **Ingress Controller**.

---

# Relationship

```
Ingress Resource
```

↓

contains rules

↓

```
/api/customers
```

↓

Customer Service

---

Who reads this?

The Ingress Controller.

Examples:

* NGINX Ingress Controller
* Traefik
* Istio Ingress Gateway
* HAProxy
* AWS ALB Controller

These are actual controllers running as pods.

---

# In your K3d cluster

Remember when you executed

```
kubectl get pods -A
```

You saw

```
svclb-traefik
```

and

```
traefik
```

You asked me months ago

"What is Traefik?"

Now you know.

**Traefik is your Ingress Controller.**

K3s installs it automatically.

So you already have an Ingress Controller.

You don't need to install NGINX.

---

# Difference between Service and Ingress

## Service

Knows Pods.

```
Customer Service

↓

Customer Pods
```

---

## Ingress

Knows Services.

```
Ingress

↓

Customer Service

↓

Customer Pods
```

---

# Complete request flow

```
Browser

↓

LoadBalancer

↓

Ingress Controller

↓

Ingress Rules

↓

Customer Service

↓

Endpoints

↓

Customer Pod
```

This is the entire path.

---

# Why not let the LoadBalancer route directly?

Excellent question.

Suppose AWS Load Balancer receives

```
GET /api/orders
```

It doesn't understand Kubernetes Services.

It only forwards traffic.

Ingress understands Kubernetes resources.

It knows:

```
Customer Service

Inventory Service

Order Service
```

because it watches the Kubernetes API Server.

---

# Path-based Routing

```
myshop.com/api/customers
```

↓

Customer Service

---

```
myshop.com/api/orders
```

↓

Order Service

---

```
myshop.com/api/products
```

↓

Inventory Service

---

# Host-based Routing

Different domains.

```
customer.myshop.com
```

↓

Customer Service

---

```
inventory.myshop.com
```

↓

Inventory Service

---

```
admin.myshop.com
```

↓

Admin UI

---

# In your enterprise

Everything you've described fits here:

```
Client

↓

API Gateway

↓

Enterprise Service Mesh

↓

AWS Network Load Balancer

↓

Istio Ingress Gateway

↓

ClusterIP Services

↓

Pods
```

Notice something.

Your **Istio Ingress Gateway** is playing the same role as Traefik or NGINX Ingress Controller.

The difference is that Istio adds service mesh capabilities on top of basic ingress routing.

---

# Practical Lab (using your project)

You already have:

```
Customer API Service

Inventory API Service
```

The next lab is to expose both APIs through a single Ingress.

The result will look like this:

```
http://localhost/api/customers
            │
            ▼
Customer Service

http://localhost/api/products
            │
            ▼
Inventory Service
```

This is the first real Ingress lab, and because K3d already includes Traefik, you can do it without installing anything else.

I recommend we build this Ingress manually (without Helm) so that every field in the YAML becomes clear before introducing Helm later. This mirrors how we've learned Deployments and Services so far.


Excellent. This is actually **exactly the behavior I expected** from your setup. You have successfully proven that **Ingress is working**, but there is one networking detail between **Windows ↔ WSL ↔ k3d** that is preventing the browser from accessing it.

Let's analyze what you have.

---

# What has been proved already?

Your terminal shows:

```bash
curl http://172.19.0.2:31747/api/customers
```

Output:

```json
[
 {"id":1,"name":"John",...}
]
```

and

```bash
curl http://172.19.0.2:31747/api/products
```

returns

```json
[
 {"id":1,"name":"Laptop",...}
]
```

This proves the entire chain is working.

```text
curl
   │
   ▼
Traefik (NodePort)
   │
   ▼
Ingress
   │
   ▼
Customer Service
   │
   ▼
Customer Pods
```

and

```text
curl
   │
   ▼
Traefik
   │
   ▼
Ingress
   │
   ▼
Inventory Service
   │
   ▼
Inventory Pods
```

So Kubernetes is **100% routing correctly**.

---

# Why browser fails

Your browser is running on

```
Windows
```

Your curl is running in

```
Ubuntu (WSL)
```

The IP

```
172.19.0.2
```

is **NOT a Windows IP**.

It belongs to Docker's internal network created by k3d.

```
Windows
    │
    │
WSL Ubuntu
    │
Docker Network
    │
k3d Nodes
```

The browser cannot directly reach

```
172.19.x.x
```

because Windows has no route to that Docker network.

That's why you get

```
ERR_CONNECTION_TIMED_OUT
```

This is **not an Ingress issue**.

---

# How do we prove this?

Run this in Windows Command Prompt:

```cmd
ping 172.19.0.2
```

It will probably fail.

Now run in Ubuntu

```bash
ping 172.19.0.2
```

It will work.

That proves the IP only exists inside Docker's virtual network.

---

# Why localhost:31747 also fails

That means k3d is **not publishing** Traefik's NodePort to Windows.

Remember:

NodePort exposes on the **Kubernetes node**, not automatically on your Windows host.

Your node is

```
k3d-demo-server-0
```

running as a Docker container.

So the flow is

```
Windows

      X

Docker Container
      │
      ▼
NodePort
```

There is no mapping from Windows → Docker container.

---

# Let's verify the port mapping

Run

```bash
docker ps
```

Look at the PORTS column for

```
k3d-demo-server-0
```

I'm looking for something like

```
0.0.0.0:8080->80/tcp
```

or

```
0.0.0.0:31747->31747/tcp
```

I suspect you will **not** see any mapping for 31747.

---

# This is because of how the cluster was created

When creating a k3d cluster, ports must be published.

For example:

```bash
k3d cluster create demo \
-p "8080:80@loadbalancer" \
-p "8443:443@loadbalancer"
```

Then Windows can simply use

```
http://localhost:8080
```

Notice something interesting.

We do **not** expose

```
31747
```

Instead we expose

```
80
```

because Traefik listens on 80 internally.

This is actually how production works.

---

# Another important observation

You typed

```
http://172.19.0.3:31747/swagger
```

and got timeout.

Even if networking worked, your Ingress does **not** have a rule for

```
/swagger
```

It only has

```
/api/customers
/api/products
```

So the correct URLs are

```
http://172.19.0.2:31747/api/customers
```

or

```
http://172.19.0.2:31747/api/products
```

The `/swagger` path is handled by your ASP.NET application, but your Ingress currently isn't routing that path.

---

# HTTPS error

You also tried

```bash
curl https://172.19.0.2:31344/api/products
```

and got

```
SSL: no alternative certificate subject name...
```

That is expected.

Why?

Because Traefik is presenting a certificate for some hostname, but you're connecting using an IP address.

TLS checks:

```
Certificate

↓

Common Name / SAN

↓

Matches hostname?
```

You used

```
172.19.0.2
```

The certificate probably contains

```
customer.local
```

or

```
example.com
```

or a default Traefik certificate.

So the TLS validation fails.

We'll solve that when we configure host-based routing and proper TLS certificates.

---

## My conclusion

You have already verified the **most important thing**:

* ✅ Traefik is running.
* ✅ Ingress resource is correct.
* ✅ Ingress routes `/api/customers` to the Customer Service.
* ✅ Ingress routes `/api/products` to the Inventory Service.
* ✅ Services forward to the correct Pods.
* ✅ Pods return the expected responses.

The only remaining issue is **making Traefik reachable from your Windows browser**. That's a k3d/port publishing setup issue, not an Ingress configuration issue.

### Before moving to host-based routing, run one command for me:

```bash
docker ps
```

and share the complete **PORTS** column for:

```
k3d-demo-server-0
```

and, if present,

```
k3d-demo-serverlb
```

That will tell us exactly why Windows cannot reach Traefik and whether we need to recreate the k3d cluster with published ports or simply use the existing load balancer container.


Perfect. This screenshot tells us **exactly** what the problem is.

Your `docker ps` output shows:

```text
k3d-demo-serverlb
PORTS:
80/tcp,
0.0.0.0:33961->6443/tcp
```

Notice something very important.

It **does not** show:

```text
0.0.0.0:80->80/tcp
```

or

```text
0.0.0.0:8080->80/tcp
```

or

```text
0.0.0.0:31747->31747/tcp
```

It only exposes:

```text
6443 (Kubernetes API Server)
```

to your Windows host.

That means:

* ✅ Traefik is running.
* ✅ Ingress is working.
* ✅ NodePort is working.
* ✅ `curl` inside Ubuntu works.
* ❌ Windows browser cannot reach Traefik because **no HTTP port has been published from the k3d load balancer container to the Windows host**.

---

## Current Architecture

```text
Windows Browser
       │
       │ ❌ No published port
       ▼
+-----------------------------+
| k3d-demo-serverlb (Docker)  |
|                             |
|  Traefik                    |
|      │                      |
|      ▼                      |
|  Ingress                    |
|      ▼                      |
| Customer Service            |
| Inventory Service           |
+-----------------------------+
```

Your browser is trying to reach something that is **not exposed outside the Docker container**.

---

## Why `curl` works in Ubuntu

When you execute:

```bash
curl http://172.19.0.2:31747/api/customers
```

the request stays **inside Docker's internal network**.

```
Ubuntu
    │
Docker Network
    │
Traefik
    │
Ingress
    │
Customer Service
```

That network is reachable from WSL.

Windows Chrome, however, is **outside** that Docker network.

---

# How should the cluster have been created?

Ideally, the cluster should be created like this:

```bash
k3d cluster create demo \
  --agents 2 \
  -p "8080:80@loadbalancer" \
  -p "8443:443@loadbalancer"
```

Then the architecture becomes:

```text
Windows Browser
       │
localhost:8080
       │
       ▼
k3d LoadBalancer
       │
Traefik
       │
Ingress
       │
ClusterIP Service
       │
Pods
```

Now you can simply browse:

```
http://localhost:8080/api/customers
```

or

```
http://localhost:8080/api/products
```

---

# Should we recreate the cluster?

Since you're still in the learning phase and don't have any persistent data, **yes**.

I recommend recreating the k3d cluster with the proper port mappings. It will save you a lot of confusion later, especially when you start testing:

* Ingress
* Host-based routing
* HTTPS
* TLS certificates
* Frontend + Backend together

---

## My recommendation

Let's recreate the cluster properly with:

* 1 server
* 2 agents
* Traefik
* Port 8080 → HTTP (80)
* Port 8443 → HTTPS (443)

Then every future lab will work directly from your Windows browser using:

```
http://localhost:8080
```

instead of using internal Docker IPs like `172.19.x.x`.

This is the same setup we'll use when we move on to host-based routing, TLS, and eventually Istio.


Perfect. This screenshot tells us **exactly** what the problem is.

Your `docker ps` output shows:

```text
k3d-demo-serverlb
PORTS:
80/tcp,
0.0.0.0:33961->6443/tcp
```

Notice something very important.

It **does not** show:

```text
0.0.0.0:80->80/tcp
```

or

```text
0.0.0.0:8080->80/tcp
```

or

```text
0.0.0.0:31747->31747/tcp
```

It only exposes:

```text
6443 (Kubernetes API Server)
```

to your Windows host.

That means:

* ✅ Traefik is running.
* ✅ Ingress is working.
* ✅ NodePort is working.
* ✅ `curl` inside Ubuntu works.
* ❌ Windows browser cannot reach Traefik because **no HTTP port has been published from the k3d load balancer container to the Windows host**.

---

## Current Architecture

```text
Windows Browser
       │
       │ ❌ No published port
       ▼
+-----------------------------+
| k3d-demo-serverlb (Docker)  |
|                             |
|  Traefik                    |
|      │                      |
|      ▼                      |
|  Ingress                    |
|      ▼                      |
| Customer Service            |
| Inventory Service           |
+-----------------------------+
```

Your browser is trying to reach something that is **not exposed outside the Docker container**.

---

## Why `curl` works in Ubuntu

When you execute:

```bash
curl http://172.19.0.2:31747/api/customers
```

the request stays **inside Docker's internal network**.

```
Ubuntu
    │
Docker Network
    │
Traefik
    │
Ingress
    │
Customer Service
```

That network is reachable from WSL.

Windows Chrome, however, is **outside** that Docker network.

---

# How should the cluster have been created?

Ideally, the cluster should be created like this:

```bash
k3d cluster create demo \
  --agents 2 \
  -p "8080:80@loadbalancer" \
  -p "8443:443@loadbalancer"
```

Then the architecture becomes:

```text
Windows Browser
       │
localhost:8080
       │
       ▼
k3d LoadBalancer
       │
Traefik
       │
Ingress
       │
ClusterIP Service
       │
Pods
```

Now you can simply browse:

```
http://localhost:8080/api/customers
```

or

```
http://localhost:8080/api/products
```

---

# Should we recreate the cluster?

Since you're still in the learning phase and don't have any persistent data, **yes**.

I recommend recreating the k3d cluster with the proper port mappings. It will save you a lot of confusion later, especially when you start testing:

* Ingress
* Host-based routing
* HTTPS
* TLS certificates
* Frontend + Backend together

---

## My recommendation

Let's recreate the cluster properly with:

* 1 server
* 2 agents
* Traefik
* Port 8080 → HTTP (80)
* Port 8443 → HTTPS (443)

Then every future lab will work directly from your Windows browser using:

```
http://localhost:8080
```

instead of using internal Docker IPs like `172.19.x.x`.

This is the same setup we'll use when we move on to host-based routing, TLS, and eventually Istio.


Excellent. You're now at the point where Ingress is actually working, and your understanding is becoming very close to how enterprise Kubernetes works. Let me refine a few points.

---

Great. This is actually the perfect time to recreate it because your application is still small. After this, every Ingress, LoadBalancer, and frontend test will work exactly like a real Kubernetes environment.

# Step 1: Export your current YAMLs (optional)

Since your YAML files are already in Git, you're safe. If not, save them:

```bash
K8S/
├── namespace/
├── customer/
│   ├── deployment.yaml
│   ├── service.yaml
├── inventory/
│   ├── deployment.yaml
│   ├── service.yaml
└── ingress/
    └── ingress.yaml
```

---

# Step 2: Delete the existing cluster

Check the cluster name:

```bash
k3d cluster list
```

You should see something like:

```text
NAME   SERVERS   AGENTS
demo      1         2
```

Delete it:

```bash
k3d cluster delete demo
```

Verify:

```bash
k3d cluster list
```

It should return no clusters.

---

# Step 3: Create a new cluster with published ports

Run:

```bash
k3d cluster create demo \
  --servers 1 \
  --agents 2 \
  -p "8080:80@loadbalancer" \
  -p "8443:443@loadbalancer"
```

Let's understand every option:

```text
--servers 1
```

One control plane node.

```text
--agents 2
```

Two worker nodes.

```text
-p "8080:80@loadbalancer"
```

Maps:

```
Windows localhost:8080
        │
        ▼
k3d LoadBalancer Container
        │
        ▼
Traefik Port 80
```

Similarly,

```text
-p "8443:443@loadbalancer"
```

Maps HTTPS.

---

# Step 4: Verify

Run:

```bash
docker ps
```

Now you should see something similar to:

```text
k3d-demo-serverlb

PORTS

0.0.0.0:8080->80/tcp
0.0.0.0:8443->443/tcp
0.0.0.0:33961->6443/tcp
```

This is exactly what was missing earlier.

---

# Step 5: Recreate your namespace

```bash
kubectl apply -f K8S/namespace/
```

Verify:

```bash
kubectl get ns
```

---

# Step 6: Deploy Customer API

```bash
kubectl apply -f K8S/customer/
```

---

# Step 7: Deploy Inventory API

```bash
kubectl apply -f K8S/inventory/
```

---

# Step 8: Deploy Ingress

```bash
kubectl apply -f K8S/ingress/
```

---

# Step 9: Verify everything

```bash
kubectl get all -n ecommerce
```

```bash
kubectl get ingress -n ecommerce
```

---

# Step 10: Test

Now these should work directly from **Windows Chrome**:

Customer API:

```text
http://localhost:8080/api/customers
```

Inventory API:

```text
http://localhost:8080/api/products
```

No Docker IPs.
No `172.19.x.x`.
No NodePort numbers.

---

# What you'll learn after recreating

This setup is very close to what you'll have in AWS:

```text
Browser
    │
localhost:8080
    │
    ▼
Traefik LoadBalancer
    │
    ▼
Ingress
    │
 ┌──┴──────────────┐
 │                 │
 ▼                 ▼
Customer Service   Inventory Service
 │                 │
 ▼                 ▼
Customer Pods      Inventory Pods
```

---

## What we'll learn next

Once this is working, we'll continue with:

1. **Host-based routing**

   * `customer.local`
   * `inventory.local`

2. **Path-based vs Host-based routing** (deep comparison)

3. **TLS/HTTPS in Ingress**

4. **How Traefik works internally**

5. **NGINX Ingress vs Traefik vs Istio Ingress Gateway**

6. **How this maps to your office architecture**:

   ```
   Internet
       ↓
   AWS Network Load Balancer
       ↓
   Istio Ingress Gateway
       ↓
   VirtualService
       ↓
   ClusterIP Service
       ↓
   Pods
   ```

This progression will make understanding your enterprise EKS + Istio setup much more intuitive because you'll have already built the same concepts locally.



# First, what happened in your lab?

You typed:

```
http://localhost:8080/api/products
```

and it worked.

The request flow was:

```text
Chrome
    │
    ▼
localhost:8080
    │
    ▼
Windows Host Port 8080
    │
    ▼
Docker Port Mapping
0.0.0.0:8080 -> 80
    │
    ▼
k3d LoadBalancer (Traefik)
    │
    ▼
Ingress Resource
    │
    ▼
Path = /api/products
    │
    ▼
inventory-api-service
    │
    ▼
Inventory Pods
```

Notice something important:

**You never talked directly to the Inventory Service.**

You talked only to **localhost:8080**.

The Ingress decided where to send the request.

---

# Question 1

> We have not provided any DNS in the Ingress YAML. From where is Ingress getting the hostname?

Very good observation.

Your Ingress looks something like this:

```yaml
rules:
- http:
    paths:
```

Notice there is **no host**.

That means:

> Match every hostname.

It is equivalent to writing:

```yaml
rules:
- host: "*"
```

or conceptually:

```text
Host = anything
```

So these are all treated the same:

```
localhost
```

```
127.0.0.1
```

```
172.19.0.2
```

```
myserver
```

As long as the request reaches Traefik, it doesn't care about the hostname because no host restriction exists.

It only checks:

```
Path = /api/products
```

---

# If you define Host

Later you'll write:

```yaml
rules:
- host: customer.local
```

Now only requests like

```
http://customer.local/api/customers
```

will match.

Not

```
localhost
```

Not

```
127.0.0.1
```

Not

```
inventory.local
```

---

# Why did localhost work?

Because your rule is effectively:

```text
Host = *
```

Path =

```
/api/products
```

---

# Question 2

You said:

> We send request to Traefik LoadBalancer. It is similar to AWS Network Load Balancer.

Exactly.

For your local cluster:

```text
Chrome

↓

localhost:8080

↓

Traefik LoadBalancer

↓

Traefik Ingress Controller

↓

Ingress Resource

↓

ClusterIP Service

↓

Pods
```

For AWS EKS:

```text
Internet

↓

AWS Network Load Balancer

↓

Istio Ingress Gateway

↓

VirtualService

↓

ClusterIP Service

↓

Pods
```

The architecture is almost identical. Only the components differ.

---

# Question 3

You wrote:

```
8080:80
```

and understood:

```
Host 8080

↓

LoadBalancer Port 80
```

Perfect.

---

# Question 4

You noticed this:

```
0.0.0.0:8080->80/tcp
```

and

```
[::]:8080->80/tcp
```

Excellent observation.

Yes.

Exactly.

The first one is

```
IPv4
```

```
0.0.0.0
```

means

> Listen on every IPv4 interface.

Example:

```
127.0.0.1

192.168.1.15

10.0.0.5
```

All IPv4 addresses.

---

The second one

```
[::]
```

is

```
IPv6
```

which means

Listen on every IPv6 interface.

Example:

```
::1

2001:db8::

fe80::
```

---

So Docker exposes both.

```
0.0.0.0:8080
```

means

IPv4

and

```
[::]:8080
```

means

IPv6

---

# Is Kubernetes using IPv4 only?

In your cluster:

```
kubectl get pods -o wide
```

shows

```
10.42.x.x
```

Services

```
10.43.x.x
```

Those are IPv4 addresses.

So yes, **your current K3d cluster is running IPv4 networking**.

However, Kubernetes itself is **not limited to IPv4**. It supports:

* IPv4 only
* IPv6 only
* Dual-stack (IPv4 + IPv6)

Many enterprise clusters today still use IPv4 only, but dual-stack support is available when configured.

---

# One more thing I want to point out

You said:

> Traefik LoadBalancer is receiving the request.

Almost.

Let's make the distinction:

You actually have **three components**:

```text
Docker Port Mapping

↓

k3d LoadBalancer Container

↓

Traefik Pod
```

The `k3d` **load balancer container** is a lightweight proxy created by k3d. Its job is to accept traffic on the published ports (80/443 inside the cluster, mapped to 8080/8443 on your host) and forward it to the correct node.

Then, **Traefik** (running as pods inside the cluster) receives the HTTP request, reads the Ingress resource, and routes it to the appropriate Kubernetes Service.

So the complete path is:

```text
Browser

↓

localhost:8080

↓

Docker Port Mapping

↓

k3d LoadBalancer Container

↓

Traefik Pods (Ingress Controller)

↓

Ingress Resource

↓

ClusterIP Service

↓

Pods
```

This distinction is important because in AWS, the **Network Load Balancer** is provided by AWS, while the **Ingress Controller** (Traefik, NGINX, or Istio Ingress Gateway) runs inside your Kubernetes cluster.

---

## You're ready for the next step

You've now understood:

* ✅ ClusterIP
* ✅ NodePort
* ✅ LoadBalancer
* ✅ Service discovery
* ✅ DNS inside the cluster
* ✅ Cross-namespace communication
* ✅ Path-based Ingress
* ✅ Traefik Ingress Controller
* ✅ Host-to-cluster port mapping

The next topic should be **host-based routing**, where you'll configure multiple hostnames such as:

* `customer.local` → Customer API
* `inventory.local` → Inventory API

This is the same pattern used in enterprise environments, where URLs like `api.company.com`, `customer.company.com`, and `inventory.company.com` are routed by the Ingress based on the **Host** header instead of the URL path.


That's a great experiment, and it's exactly how you build intuition about Kubernetes networking. Let's do it in two phases.

---

# Phase 1: Access from your mobile on the same Wi-Fi

## Step 1: Find your Windows IP

Open **Command Prompt** (not WSL) and run:

```cmd
ipconfig
```

Look for your active Wi-Fi adapter.

You'll see something like:

```text
Wireless LAN adapter Wi-Fi:

IPv4 Address . . . . . . . . : 192.168.1.20
Subnet Mask . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . : 192.168.1.1
```

The important one is:

```text
192.168.1.20
```

---

## Step 2: Test from Windows first

Before using your phone, verify on Windows:

```text
http://192.168.1.20:8080/api/customers
```

If this works, your application is listening on your Windows network interface.

---

## Step 3: Test from your phone

Connect your phone to the same Wi-Fi.

Open Chrome and browse:

```text
http://192.168.1.20:8080/api/customers
```

If everything is configured correctly, you'll see the JSON response.

---

# Phase 2: Check Windows Firewall

Search for:

```text
Windows Defender Firewall with Advanced Security
```

Open it.

On the left, click:

```text
Inbound Rules
```

Look for a rule allowing:

* TCP
* Port 8080

If you don't find one, create it.

### Create a new inbound rule

1. Click **New Rule...**
2. Select **Port**
3. Click **Next**
4. Choose **TCP**
5. Enter:

```text
8080
```

6. Click **Next**
7. Select:

```text
Allow the connection
```

8. Click **Next**
9. Check:

* Domain
* Private

(You usually don't need Public for home use.)

10. Give it a name:

```text
K3D 8080
```

Click **Finish**.

Now Windows allows incoming traffic on port 8080.

---

# Phase 3: Can you test over mobile data (Internet)?

This is the interesting part.

The answer is:

**Probably not**, and that's expected.

Why?

Your laptop is behind your home router.

The Internet looks like this:

```text
Internet

↓

Home Router

↓

192.168.1.20 (Laptop)
```

Your laptop has a **private IP**:

```text
192.168.x.x
```

Private IPs are **not reachable from the Internet**.

If your phone switches to mobile data, then:

```text
Phone (4G)

↓

Internet

↓

???
```

The Internet has no route to:

```text
192.168.1.20
```

So it won't work.

---

# Why doesn't it work?

Your home router performs **NAT (Network Address Translation)**.

Your router has:

* one public IP (visible on the Internet)
* many private devices inside your home

For example:

```text
Public IP

49.36.xx.xx
```

Inside your home:

```text
192.168.1.10
192.168.1.15
192.168.1.20
```

The Internet can only see:

```text
49.36.xx.xx
```

It cannot directly reach:

```text
192.168.1.20
```

---

# Can you make it work over the Internet?

Yes, but you need one of these:

### Option 1 (Recommended for learning)

Use a tunnel like:

* Cloudflare Tunnel
* ngrok

They expose your local application with a public HTTPS URL.

For example:

```text
https://abc123.ngrok.app
```

Anyone on the Internet can open it.

---

### Option 2

Configure **port forwarding** on your home router.

Example:

```text
Internet Port 8080

↓

Router

↓

192.168.1.20:8080
```

This works, but it's generally **not recommended** unless you understand the security implications.

---

### Option 3 (Enterprise approach)

Deploy your application to a cloud Kubernetes cluster (EKS, AKS, GKE) behind a cloud Load Balancer.

That's what production environments do.

---

# What I expect in your experiment

### Test 1

```text
localhost:8080
```

✅ Should work.

---

### Test 2

```text
http://<Windows-IP>:8080
```

from your Windows browser.

✅ Should work.

---

### Test 3

```text
http://<Windows-IP>:8080
```

from your phone on the same Wi-Fi.

✅ Should work if the firewall allows it.

---

### Test 4

```text
http://<Windows-IP>:8080
```

from mobile data.

❌ It should fail, because `192.168.x.x` is a private address and isn't reachable over the Internet.

---

After you've completed these tests, send me:

* the output of `ipconfig` (just the IPv4 address is enough),
* whether Test 2 succeeded,
* whether Test 3 succeeded,
* and what error you got in Test 4.

Based on those results, we'll know exactly where the networking is working and why.

