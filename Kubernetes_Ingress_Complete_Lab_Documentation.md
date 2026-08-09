# Kubernetes Ingress --- Complete Lab Documentation

## 1. What We Built

This lab uses a local K3D Kubernetes cluster with Traefik as the Ingress
Controller.

The learning sequence was:

1.  Create Kubernetes Deployments.
2.  Create Kubernetes Services.
3.  Understand Service → Pod routing.
4.  Install/use the existing Traefik Ingress Controller.
5.  Create a manual Ingress resource.
6.  Implement path-based routing.
7.  Test the Ingress endpoint.
8.  Implement host-based routing.
9.  Implement host + path (mixed) routing.
10. Understand DNS/hosts-file resolution for the local lab.
11. Configure HTTPS/TLS.
12. Generate a self-signed certificate with OpenSSL.
13. Create a Kubernetes TLS Secret.
14. Attach the TLS Secret to the Ingress.
15. Inspect the TLS 1.3 handshake with `openssl s_client`.
16. Understand TLS termination at Traefik.
17. Understand encrypted TLS Application Data and how it can be
    inspected with Wireshark.

------------------------------------------------------------------------

# 2. Ingress --- What It Does

An Ingress is a Kubernetes API resource that defines HTTP/HTTPS routing
rules.

The Ingress resource itself does not normally process network traffic.
An Ingress Controller such as Traefik watches the Ingress resource and
implements those rules.

Conceptually:

Client \| \| HTTP/HTTPS v Load Balancer \| v Traefik Ingress Controller
\| \| routing rules v Kubernetes Service \| v Pod

The important distinction is:

-   Ingress = routing configuration
-   Ingress Controller = software that implements the routing
-   Service = stable Kubernetes endpoint that forwards to Pods

------------------------------------------------------------------------

# 3. IngressClass

Our Ingress used:

``` yaml
spec:
  ingressClassName: traefik
```

This tells Kubernetes which Ingress Controller should process the
resource.

This becomes important when a cluster has multiple controllers, for
example:

-   Traefik
-   NGINX Ingress Controller
-   HAProxy
-   another controller

If a cluster has a configured default IngressClass, `ingressClassName`
can sometimes be omitted. For predictable production configuration,
explicitly specifying the intended class is generally clearer.

------------------------------------------------------------------------

# 4. Path-Based Routing

Our initial Ingress looked conceptually like:

``` yaml
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: ecommerce-ingress
  namespace: ecommerce

spec:
  ingressClassName: traefik

  rules:
    - http:
        paths:

          - path: /api/customers
            pathType: Prefix
            backend:
              service:
                name: customer-api-service
                port:
                  number: 80

          - path: /api/products
            pathType: Prefix
            backend:
              service:
                name: inventory-api-service
                port:
                  number: 80
```

The routing logic is:

``` text
/api/customers/*  -> customer-api-service:80
/api/products/*   -> inventory-api-service:80
```

`Prefix` means the path is matched by prefix.

For example:

``` text
/api/customers
/api/customers/123
/api/customers/orders
```

can match the `/api/customers` prefix.

The Ingress service port is the Service port, NOT the Pod's targetPort.

For example:

``` yaml
Service:
  port: 80
  targetPort: 8080
```

Then Ingress uses:

``` yaml
port:
  number: 80
```

The Service then forwards:

``` text
Service:80 -> Pod:8080
```

------------------------------------------------------------------------

# 5. Host-Based Routing

Host-based routing adds a hostname:

``` yaml
rules:

  - host: customer.test
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: customer-api-service
              port:
                number: 80

  - host: inventory.test
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: inventory-api-service
              port:
                number: 80
```

The routing becomes:

``` text
customer.test/*   -> customer-api-service:80
inventory.test/*  -> inventory-api-service:80
```

For the local lab we added the hostnames to the Windows hosts file:

``` text
127.0.0.1 customer.test
127.0.0.1 inventory.test
```

Important:

`127.0.0.1` is the local loopback address. It is not the laptop's
Wi-Fi/LAN IP.

For external devices, DNS and network exposure are separate concerns.

------------------------------------------------------------------------

# 6. Mixed Host + Path Routing

We then combined both conditions:

``` yaml
rules:

  - host: customer.test
    http:
      paths:
        - path: /api/customers
          pathType: Prefix
          backend:
            service:
              name: customer-api-service
              port:
                number: 80

  - host: inventory.test
    http:
      paths:
        - path: /api/products
          pathType: Prefix
          backend:
            service:
              name: inventory-api-service
              port:
                number: 80
```

Now both host AND path must match.

Example:

``` text
customer.test/api/customers
```

matches.

But:

``` text
customer.test/api/products
```

does not match the customer rule.

This gives more restrictive routing than simply using:

``` text
customer.test/*
```

------------------------------------------------------------------------

# 7. Path-Based vs Host-Based vs Mixed

  Routing      Example                         Main matching condition
  ------------ ------------------------------- -------------------------
  Path-based   `/api/customers`                URL path
  Host-based   `customer.test`                 Hostname
  Mixed        `customer.test/api/customers`   Host + path

Mixed routing is useful when we want to narrow the traffic reaching a
particular backend.

------------------------------------------------------------------------

# 8. Local K3D Port Mapping

Our local K3D cluster exposed the Traefik/load-balancer entry point
through host port mapping.

Conceptually:

``` text
Windows host : 8443
        |
        v
WSL/K3D load balancer : 443
        |
        v
Traefik
```

Similarly for HTTP:

``` text
Windows host : 8080
        |
        v
K3D load balancer : 80
        |
        v
Traefik
```

This is a local development mechanism.

In a production cloud environment, we normally do not manually expose
ports through K3D-style Docker port mappings.

------------------------------------------------------------------------

# 9. HTTP vs HTTPS

HTTP is the application protocol used for request/response
communication.

HTTPS is HTTP protected by TLS.

Conceptually:

``` text
HTTP:
GET /api/customers

HTTPS:
TLS
  +
HTTP
```

TLS provides:

-   encryption/confidentiality
-   integrity
-   server authentication
-   optionally client authentication (mTLS)

------------------------------------------------------------------------

# 10. TLS Certificate --- What It Is

A TLS certificate primarily provides server identity.

Our certificate contained information such as:

``` text
Subject
Issuer
Validity
Public Key
Signature Algorithm
Subject Alternative Name (SAN)
Certificate Signature
```

Our lab certificate had:

``` text
CN = customer.test
```

and SAN entries:

``` text
DNS:customer.test
DNS:inventory.test
```

SAN is particularly important for hostname verification.

Modern TLS hostname validation primarily relies on SAN rather than the
old CN-only approach.

------------------------------------------------------------------------

# 11. Certificate vs Private Key

We created two important cryptographic files:

``` text
ecommerce.key
ecommerce.crt
```

The certificate:

``` text
ecommerce.crt
```

can be shared with clients.

The private key:

``` text
ecommerce.key
```

must remain secret.

Conceptually:

``` text
Certificate
  |
  +-- Public key
  +-- Identity
  +-- SAN
  +-- Validity
  +-- CA signature

Private key
  |
  +-- MUST remain secret
```

The private key is used by the TLS server to prove possession of the key
corresponding to the certificate.

------------------------------------------------------------------------

# 12. What Is the `.cnf` File?

The OpenSSL `.cnf` file is configuration/input for certificate
generation.

Example:

``` ini
[req]
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[req_distinguished_name]
CN = customer.test

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = customer.test
DNS.2 = inventory.test
```

The important part for our lab is the SAN configuration.

The `.cnf` file is NOT normally part of the final TLS handshake.

It is an input used while generating the certificate.

In production, application teams usually do not manually create OpenSSL
`.cnf` files for every certificate. Certificates may be issued by:

-   Enterprise PKI
-   Certificate Authority
-   AWS Certificate Manager
-   Azure Key Vault / certificate services
-   cert-manager
-   internal certificate-management platforms

The exact process depends on the organization's PKI architecture.

------------------------------------------------------------------------

# 13. Lab Certificate Generation

For the local lab, the basic OpenSSL process was:

## Step 1 --- Generate private key

``` bash
openssl genrsa -out ecommerce.key 2048
```

## Step 2 --- Create certificate using the configuration

``` bash
openssl req \
  -x509 \
  -new \
  -key ecommerce.key \
  -sha256 \
  -days 365 \
  -out ecommerce.crt \
  -config ecommerce.cnf \
  -extensions req_ext
```

This gives:

``` text
ecommerce.key
ecommerce.crt
```

For a production certificate, the private key should be handled securely
and should generally not be committed to Git.

------------------------------------------------------------------------

# 14. Inspect the Certificate

To inspect the certificate:

``` bash
openssl x509 \
  -in ecommerce.crt \
  -text \
  -noout
```

To specifically inspect SAN:

``` bash
openssl x509 \
  -in ecommerce.crt \
  -noout \
  -ext subjectAltName
```

Expected result:

``` text
X509v3 Subject Alternative Name:
    DNS:customer.test
    DNS:inventory.test
```

To inspect subject/issuer/dates:

``` bash
openssl x509 \
  -in ecommerce.crt \
  -noout \
  -subject \
  -issuer \
  -dates
```

------------------------------------------------------------------------

# 15. Create Kubernetes TLS Secret

Kubernetes expects a TLS Secret containing:

``` text
tls.crt
tls.key
```

Create it with:

``` bash
kubectl create secret tls ecommerce-tls \
  --cert=ecommerce.crt \
  --key=ecommerce.key \
  -n ecommerce
```

Verify:

``` bash
kubectl get secret ecommerce-tls -n ecommerce
```

You should see:

``` text
TYPE: kubernetes.io/tls
```

The certificate and private key are now stored as a Kubernetes Secret.

In production, Secret management is usually strengthened with solutions
such as:

-   AWS Secrets Manager
-   AWS Certificate Manager
-   External Secrets
-   cert-manager
-   Vault
-   cloud KMS/HSM-backed systems

depending on the architecture.

------------------------------------------------------------------------

# 16. Attach TLS Secret to Ingress

Our Ingress then contains:

``` yaml
spec:

  tls:
    - hosts:
        - customer.test
        - inventory.test
      secretName: ecommerce-tls
```

Then the routing rules follow.

Example:

``` yaml
spec:
  ingressClassName: traefik

  tls:
    - hosts:
        - customer.test
        - inventory.test
      secretName: ecommerce-tls

  rules:
    - host: customer.test
      http:
        paths:
          - path: /api/customers
            pathType: Prefix
            backend:
              service:
                name: customer-api-service
                port:
                  number: 80

    - host: inventory.test
      http:
        paths:
          - path: /api/products
            pathType: Prefix
            backend:
              service:
                name: inventory-api-service
                port:
                  number: 80
```

------------------------------------------------------------------------

# 17. What Does `tls` Do in Ingress?

It tells the Ingress Controller:

> For these hostnames, use this TLS Secret when handling HTTPS.

The Secret contains the certificate and private key.

The flow is:

``` text
HTTPS client
     |
     | TLS handshake
     v
Traefik
     |
     | uses ecommerce-tls
     |
     +-- certificate
     +-- private key
     |
     v
TLS termination
     |
     v
HTTP routing
```

------------------------------------------------------------------------

# 18. TLS Termination

TLS termination means that the TLS connection ends at the component
acting as the TLS endpoint.

In our lab:

``` text
Client
  |
  | HTTPS / encrypted
  v
Traefik
  |
  | TLS termination
  v
HTTP request
  |
  v
Service
  |
  v
Pod
```

It does NOT mean the TCP connection is simply terminated.

It means Traefik decrypts the TLS-protected application data and then
processes the HTTP request.

If desired, TLS can instead be re-established from the proxy to the
backend. That is a separate design, often called TLS re-encryption or
end-to-end TLS depending on the architecture.

------------------------------------------------------------------------

# 19. TLS Handshake We Observed

We used:

``` bash
openssl s_client \
  -connect 127.0.0.1:8443 \
  -servername customer.test \
  -msg \
  -state
```

The actual TLS 1.3 sequence observed was approximately:

``` text
Client
  |
  | ClientHello
  | SNI = customer.test
  | supported TLS versions
  | supported cipher suites
  | key share
  |
  v
Server
  |
  | ServerHello
  | selects TLS parameters
  |
  | EncryptedExtensions
  |
  | Certificate
  |
  | CertificateVerify
  |
  | Finished
  |
  v
Client
  |
  | Finished
  |
  v
TLS handshake complete
```

Our output confirmed:

``` text
Protocol: TLSv1.3
Cipher: TLS_AES_128_GCM_SHA256
Negotiated TLS1.3 group: X25519MLKEM768
```

------------------------------------------------------------------------

# 20. Important: Cipher Suite Is Not the Encryption Key

Do NOT interpret:

``` text
TLS_AES_128_GCM_SHA256
```

as the actual encryption key.

It describes cryptographic algorithms.

The actual traffic keys are derived during the TLS 1.3 key schedule.

Conceptually:

``` text
Client key share
        +
Server key share
        |
        v
Key agreement
        |
        v
Shared secret
        |
        v
TLS 1.3 key schedule
        |
        v
Traffic secrets
        |
        v
Traffic encryption keys
        |
        v
AES-128-GCM
```

The key share is not itself the AES key.

------------------------------------------------------------------------

# 21. What Does the Certificate Do?

The certificate is primarily about identity and authentication.

It tells the client:

``` text
This certificate represents customer.test
Here is the server's public key
Here is who issued the certificate
Here is the validity period
Here are the SAN DNS names
```

The server then uses `CertificateVerify` to prove possession of the
corresponding private key.

Therefore:

``` text
Certificate
    |
    +-- identity
    +-- public key
    +-- SAN
    +-- validity
    +-- issuer/signature

Private key
    |
    +-- kept secret
    +-- proves possession during TLS handshake
```

------------------------------------------------------------------------

# 22. Where Is SAN?

Our certificate contained:

``` text
DNS:customer.test
DNS:inventory.test
```

Inspect it directly:

``` bash
openssl x509 \
  -in ecommerce.crt \
  -noout \
  -ext subjectAltName
```

The raw `openssl s_client -msg` output does not present SAN in a
convenient human-readable format because it is showing the raw
certificate bytes.

------------------------------------------------------------------------

# 23. What Does CertificateVerify Do?

The server sends:

``` text
Certificate
```

and then:

``` text
CertificateVerify
```

The certificate contains the public key.

CertificateVerify proves that the server possesses the corresponding
private key and is participating in the current TLS handshake.

Conceptually:

``` text
Server private key
       |
       v
signature over handshake transcript
       |
       v
CertificateVerify
       |
       v
Client verifies using public key
```

------------------------------------------------------------------------

# 24. Our Self-Signed Certificate

Our certificate output showed:

``` text
subject=CN=customer.test
issuer=CN=customer.test
```

Therefore it is self-signed.

OpenSSL reported:

``` text
Verify return code: 18 (self-signed certificate)
```

This does not mean TLS negotiation failed.

Our output also showed:

``` text
SSL negotiation finished successfully
```

The TLS connection succeeded; certificate trust validation failed
because our lab certificate is not signed by a CA trusted by the client.

------------------------------------------------------------------------

# 25. Early Data

Our output showed:

``` text
Early data was not sent
```

This relates to TLS 1.3 0-RTT.

It means the connection did not send application data during the
early-data phase.

For the current lab, this can be ignored.

------------------------------------------------------------------------

# 26. NewSessionTicket

After the handshake we saw:

``` text
NewSessionTicket
```

This can be used for future TLS session resumption.

It is NOT the HTTP encryption key.

Do not confuse:

``` text
Session ID
Session Ticket
Traffic Encryption Key
```

They are different concepts.

------------------------------------------------------------------------

# 27. The Actual HTTP Encryption

Before TLS:

``` http
GET /api/customers HTTP/1.1
Host: customer.test
```

After TLS protection, the network carries TLS Application Data.

Conceptually:

``` text
HTTP request
     |
     v
TLS record
     |
     v
AES-128-GCM
     |
     v
Encrypted Application Data
```

A packet capture will therefore contain encrypted bytes rather than
readable:

``` text
GET /api/customers
```

------------------------------------------------------------------------

# 28. Capture TLS Traffic

Install/check tcpdump:

``` bash
tcpdump --version
```

Capture:

``` bash
sudo tcpdump -i any -w tls-capture.pcap port 8443
```

In another terminal, send a real HTTP request:

``` bash
printf 'GET /api/customers HTTP/1.1\r\nHost: customer.test\r\nConnection: close\r\n\r\n' | \
openssl s_client \
  -connect 127.0.0.1:8443 \
  -servername customer.test
```

Stop tcpdump with:

``` text
Ctrl+C
```

------------------------------------------------------------------------

# 29. Generate a TLS Key Log

For a lab/debugging environment, OpenSSL can write TLS secrets to a
key-log file:

``` bash
printf 'GET /api/customers HTTP/1.1\r\nHost: customer.test\r\nConnection: close\r\n\r\n' | \
openssl s_client \
  -connect 127.0.0.1:8443 \
  -servername customer.test \
  -keylogfile tls-keys.log
```

This produces:

``` text
tls-keys.log
```

Important security warning:

The key-log file contains sensitive TLS secrets. Never commit it to Git
or expose it in production.

------------------------------------------------------------------------

# 30. Wireshark Verification

Open:

``` text
tls-capture.pcap
```

In Wireshark:

``` text
Edit
  -> Preferences
     -> Protocols
        -> TLS
```

Configure the TLS key-log file:

``` text
tls-keys.log
```

Then Wireshark can use the secrets to decrypt the captured TLS
Application Data.

Without the key log:

``` text
TLS Application Data
17 03 03 ...
encrypted bytes...
```

With the key log:

``` text
TLS Application Data
        |
        v
     decrypt
        |
        v
GET /api/customers HTTP/1.1
Host: customer.test
```

This is the practical demonstration of TLS encryption.

------------------------------------------------------------------------

# 31. The Complete Lab Architecture

``` text
Windows
   |
   | localhost:8443
   v
WSL
   |
   v
K3D Load Balancer
   |
   v
Traefik Ingress Controller
   |
   | TLS termination
   |
   +-----------------------------+
   |                             |
   v                             v
Host/path routing             HTTPS
   |                             |
   v                             |
Kubernetes Service              |
   |                             |
   v                             |
Customer/Inventory Pod <---------+
```

More precisely for HTTPS:

``` text
Client
  |
  | HTTPS
  | TLS encrypted
  v
K3D Load Balancer
  |
  v
Traefik
  |
  | TLS termination
  | decrypt
  v
HTTP request
  |
  | Host + Path matching
  v
Service
  |
  v
Pod
```

------------------------------------------------------------------------

# 32. Is This the Same as Production?

The concepts are the same, but the infrastructure is different.

## Our lab

``` text
Windows
  |
WSL
  |
K3D
  |
K3D Load Balancer
  |
Traefik
  |
Service
  |
Pod
```

## Typical AWS/EKS architecture

A common design can look like:

``` text
Internet
   |
   v
DNS
   |
   v
AWS Load Balancer
   |
   v
Ingress Controller / Istio Gateway
   |
   v
Kubernetes Service
   |
   v
Pod
```

The AWS load balancer may be:

-   Application Load Balancer (ALB)
-   Network Load Balancer (NLB)

depending on the architecture and controller/gateway configuration.

The load balancer and Kubernetes cluster are not necessarily separate
Kubernetes clusters. A cloud load balancer is normally an external
cloud-managed networking resource associated with the Kubernetes
workload.

------------------------------------------------------------------------

# 33. Production Certificate Alternatives

We generated a certificate manually with:

``` text
OpenSSL
```

In production, organizations commonly use managed or automated
certificate systems.

Examples:

``` text
AWS Certificate Manager
Enterprise PKI
HashiCorp Vault PKI
cert-manager
Cloud certificate services
Internal CA
```

The application team usually should not generate arbitrary production
self-signed certificates.

A common production flow is:

``` text
Certificate Authority / PKI
        |
        v
Production certificate
        |
        v
Secret/certificate management
        |
        v
Ingress / Gateway / Load Balancer
```

The exact location of TLS termination depends on the architecture.

------------------------------------------------------------------------

# 34. Where Can TLS Terminate in Production?

TLS can terminate at different layers.

### Option A --- Load Balancer termination

``` text
Client
  |
 HTTPS
  v
AWS Load Balancer
  |
 HTTP
  v
Ingress
```

### Option B --- Ingress/Gateway termination

``` text
Client
  |
 HTTPS
  v
Load Balancer
  |
 HTTPS
  v
Ingress / Istio Gateway
  |
 HTTP
  v
Service
```

### Option C --- End-to-end/re-encrypted

``` text
Client
  |
 HTTPS
  v
Load Balancer
  |
 HTTPS
  v
Gateway
  |
 HTTPS
  v
Service
  |
 HTTPS
  v
Application
```

The choice depends on security requirements and architecture.

------------------------------------------------------------------------

# 35. What Else Can Ingress Do?

Ingress is primarily about HTTP/HTTPS application-layer routing, but
implementations such as Traefik provide many additional capabilities.

Common capabilities include:

-   Host-based routing
-   Path-based routing
-   Host + path routing
-   TLS termination
-   TLS certificate selection
-   Redirect HTTP → HTTPS
-   HTTP header manipulation
-   Authentication integration
-   Rate limiting
-   Middleware
-   Request/response transformations
-   Load balancing across Service endpoints
-   URL/path rewriting
-   Access control features
-   Observability/logging
-   Sometimes TCP/UDP routing through controller-specific features

Important distinction:

Some of these are **standard Kubernetes Ingress concepts**, while many
are **Ingress Controller-specific features**.

For example, Traefik middleware is not the same thing as the portable
Kubernetes Ingress API.

------------------------------------------------------------------------

# 36. What Ingress Is NOT

Ingress is not:

-   An API Gateway by definition
-   A Service Mesh
-   A Kubernetes Service
-   A DNS server
-   A certificate authority
-   A replacement for all load balancers

An Ingress Controller can provide gateway-like capabilities, but API
Gateway and Ingress are different architectural concepts.

Similarly:

``` text
Ingress
```

handles north-south HTTP/HTTPS entry into a Kubernetes environment.

A service mesh such as Istio primarily manages service-to-service
communication and east-west traffic, although Istio also provides
ingress gateways.

------------------------------------------------------------------------

# 37. Current Learning Status

We have now covered:

``` text
DONE

Kubernetes Service
        ↓
Ingress Controller
        ↓
Path-based routing
        ↓
Host-based routing
        ↓
Host + path routing
        ↓
HTTP
        ↓
HTTPS
        ↓
TLS certificate
        ↓
SAN
        ↓
Private key
        ↓
TLS Secret
        ↓
Ingress TLS configuration
        ↓
TLS termination
        ↓
TLS 1.3 handshake
        ↓
CertificateVerify
        ↓
Key exchange
        ↓
Traffic key derivation
        ↓
AES-128-GCM
        ↓
Encrypted Application Data
        ↓
OpenSSL debugging
        ↓
Packet capture / Wireshark
```

------------------------------------------------------------------------

# 38. Next Topic

The next logical topic is:

``` text
mTLS — Mutual TLS
```

We will first implement mTLS manually with OpenSSL so that you can see:

``` text
Server Certificate
+
Client Certificate
+
CertificateRequest
+
Client CertificateVerify
```

Then we will connect the exact same concept to Istio:

``` text
Application
    |
Envoy sidecar
    |
    | mTLS
    v
Envoy sidecar
    |
Application
```

That will make Istio's automatic workload certificates,
PeerAuthentication, STRICT mTLS, and service-to-service identity much
easier to understand.
