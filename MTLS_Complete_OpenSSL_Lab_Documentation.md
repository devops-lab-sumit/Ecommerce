# Mutual TLS (mTLS) — Complete OpenSSL Lab Documentation

## 1. Purpose

This document records the manual mTLS lab we built before moving to Kubernetes/Istio mTLS.

The goal was not merely to make HTTPS work. The goal was to understand the complete story:

```text
Root CA
  ↓
Server identity
  ↓
Client identity
  ↓
Certificate verification
  ↓
Private-key proof
  ↓
TLS 1.3 key exchange
  ↓
Traffic-key derivation
  ↓
Encrypted HTTP
```

Normal TLS authenticates the server to the client.

mTLS adds the reverse direction:

```text
Client authenticates Server
+
Server authenticates Client
=
Mutual TLS
```


## 2. Why We Need a CA

A certificate contains an identity and public key, but the receiver also needs to know who issued and trusted that certificate.

For our lab we created:

```text
Ecommerce-Root-CA
```

It signs both endpoint certificates:

```text
                 Ecommerce-Root-CA
                        |
             +----------+----------+
             |                     |
             v                     v
        server.crt             client.crt
        CN=mtls-server         CN=ecommerce-client
```

The CA certificate (`ca.crt`) is trust information.

The CA private key (`ca.key`) is highly sensitive and must remain secret.

A production PKI may use an offline root CA and intermediate CAs, but for this learning lab we used one root CA directly.


## 3. Lab Folder

Our working directory was:

```text
~/MyFolder/Ecommerce/mtls-lab
```

The resulting files were:

```text
mtls-lab/
│
├── ca.crt
├── ca.key
├── ca.srl
│
├── server.cnf
├── server.csr
├── server.crt
├── server.key
│
├── client.cnf
├── client.csr
├── client.crt
└── client.key
```

Meaning:

| File | Purpose | Secret? |
|---|---|---|
| `ca.key` | Root CA private key | YES |
| `ca.crt` | Root CA certificate | No |
| `ca.srl` | CA signing serial state | No/low sensitivity |
| `server.key` | Server private key | YES |
| `server.csr` | Server certificate request | No/low sensitivity |
| `server.crt` | Server certificate | No |
| `client.key` | Client private key | YES |
| `client.csr` | Client certificate request | No/low sensitivity |
| `client.crt` | Client certificate | No |
| `*.cnf` | OpenSSL certificate-generation configuration | Usually no |


## 4. Create the Root CA

We first needed an authority capable of issuing trusted endpoint certificates.

### 4.1 Generate CA private key

```bash
openssl genrsa -out ca.key 4096
```

The important point is:

```text
ca.key = secret
```

Anyone who controls this key may be able to issue certificates trusted by our lab.

### 4.2 Create the self-signed root CA certificate

```bash
openssl req -x509 -new -sha256 \
  -key ca.key \
  -out ca.crt \
  -days 3650 \
  -subj "/CN=Ecommerce-Root-CA"
```

A root CA is normally self-signed, so:

```text
Subject = Ecommerce-Root-CA
Issuer  = Ecommerce-Root-CA
```

Inspect it:

```bash
openssl x509 -in ca.crt -noout -subject -issuer -dates
```

or:

```bash
openssl x509 -in ca.crt -text -noout
```


## 5. Create the Server Identity

Our server is called:

```text
mtls-server
```

The server needs:

```text
server.key
server.crt
```

The private key proves possession of the identity represented by the certificate.

### 5.1 Generate server private key

```bash
openssl genrsa -out server.key 2048
```

### 5.2 Create `server.cnf`

A representative configuration is:

```ini
[req]
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[req_distinguished_name]
CN = mtls-server

[req_ext]
subjectAltName = @alt_names
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = mtls-server
DNS.2 = localhost
IP.1 = 127.0.0.1
```

The important ideas are:

```text
SAN             = names by which the server may be verified
serverAuth      = intended for TLS server authentication
```

The `.cnf` file is used while creating the certificate. It is not sent as a TLS message.

### 5.3 Create server CSR

```bash
openssl req -new \
  -key server.key \
  -out server.csr \
  -config server.cnf
```

The CSR is a request:

```text
"I want a certificate representing mtls-server."
```

### 5.4 Sign the CSR with our CA

```bash
openssl x509 -req \
  -in server.csr \
  -CA ca.crt \
  -CAkey ca.key \
  -CAcreateserial \
  -out server.crt \
  -days 825 \
  -sha256 \
  -extfile server.cnf \
  -extensions req_ext
```

Now:

```text
Ecommerce-Root-CA
       |
       | signs
       v
server.crt
```

Inspect:

```bash
openssl x509 -in server.crt -noout -subject -issuer -dates
```

Our actual lab certificate showed:

```text
subject=CN=mtls-server
issuer=CN=Ecommerce-Root-CA
```

Inspect SAN/EKU:

```bash
openssl x509 -in server.crt -noout -ext subjectAltName -ext extendedKeyUsage
```

The lab certificate showed the server-authentication EKU.


## 6. Create the Client Identity

mTLS requires a second identity. The server must be able to say:

> "This is an approved client, not merely somebody who reached my port."

Our client identity is:

```text
ecommerce-client
```

### 6.1 Generate client private key

```bash
openssl genrsa -out client.key 2048
```

### 6.2 Create `client.cnf`

Representative configuration:

```ini
[req]
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[req_distinguished_name]
CN = ecommerce-client

[req_ext]
subjectAltName = @alt_names
extendedKeyUsage = clientAuth

[alt_names]
DNS.1 = ecommerce-client
```

The important difference is:

```text
server certificate -> serverAuth
client certificate -> clientAuth
```

### 6.3 Create client CSR

```bash
openssl req -new \
  -key client.key \
  -out client.csr \
  -config client.cnf
```

### 6.4 Sign client CSR

```bash
openssl x509 -req \
  -in client.csr \
  -CA ca.crt \
  -CAkey ca.key \
  -CAcreateserial \
  -out client.crt \
  -days 825 \
  -sha256 \
  -extfile client.cnf \
  -extensions req_ext
```

Inspect:

```bash
openssl x509 -in client.crt -noout -subject -issuer -dates
```

Our actual output showed:

```text
Issuer: CN=Ecommerce-Root-CA
Subject: CN=ecommerce-client
```

and:

```text
TLS Web Client Authentication
```

So the trust structure is now:

```text
                 Ecommerce-Root-CA
                        |
              +---------+---------+
              |                   |
              v                   v
        mtls-server          ecommerce-client
              |                   |
         server.key            client.key
```


## 7. Verify the Certificates Before TLS

Verify the server certificate against our CA:

```bash
openssl verify -CAfile ca.crt server.crt
```

Expected:

```text
server.crt: OK
```

Verify the client certificate:

```bash
openssl verify -CAfile ca.crt client.crt
```

Expected:

```text
client.crt: OK
```

This proves the certificates chain to the CA we trust.


## 8. Start the mTLS Server

For the lab we used OpenSSL's built-in test server:

```bash
openssl s_server \
  -accept 9443 \
  -cert server.crt \
  -key server.key \
  -CAfile ca.crt \
  -Verify 1 \
  -www \
  -state \
  -msg
```

Meaning:

```text
-accept 9443
    Listen on TCP 9443

-cert server.crt
    Server identity

-key server.key
    Server private key

-CAfile ca.crt
    CA trusted for client certificates

-Verify 1
    Require and verify a client certificate

-www
    Return a simple HTTP response

-state
    Show OpenSSL handshake state

-msg
    Show TLS protocol messages
```

The most important mTLS option is:

```text
-Verify 1
```

Without client authentication, the server could simply authenticate itself.

With `-Verify 1`, it says:

> "I also require the client to authenticate."


## 9. First Prove That Client Authentication Is Required

Before giving the client a certificate, test:

```bash
openssl s_client \
  -connect 127.0.0.1:9443 \
  -servername mtls-server \
  -CAfile ca.crt
```

The server can present its certificate, but the client has no certificate to send back.

Our lab captured:

```text
fatal certificate_required
```

This is a critical learning test:

```text
Server requires client certificate
            |
            v
Client sends no certificate
            |
            v
Handshake rejected
```

Therefore mTLS is not just "HTTPS with a certificate somewhere"; the server is actively requiring client authentication.


## 10. Successful mTLS Connection

Now provide the client certificate and matching private key:

```bash
openssl s_client \
  -connect 127.0.0.1:9443 \
  -servername mtls-server \
  -cert client.crt \
  -key client.key \
  -CAfile ca.crt
```

Meaning:

```text
-connect
    Server address/port

-servername
    SNI/hostname requested by the client

-cert
    Client certificate

-key
    Client private key

-CAfile
    CA trusted by the client for server verification
```

Our successful run showed:

```text
Verification: OK
Verify return code: 0 (ok)
```

and:

```text
Protocol: TLSv1.3
Cipher: TLS_AES_256_GCM_SHA384
Negotiated TLS1.3 group: X25519MLKEM768
```

The server ultimately returned:

```text
HTTP/1.0 200 ok
```

That is the successful end-to-end result of the lab.


## 11. The Complete mTLS Handshake Story

Now tell the story from the network's point of view.

### Step 1 — TCP connection

```text
CLIENT ---------------- TCP ----------------> SERVER:9443
```

OpenSSL showed:

```text
CONNECTED(00000003)
```

### Step 2 — ClientHello

The client says:

> "Here are the TLS versions, cipher suites, key-exchange groups, key share, SNI and extensions I support."

Important items include:

```text
TLS versions
Cipher suites
Key exchange groups
Key share
SNI
Extensions
```

### Step 3 — ServerHello

The server selects compatible parameters.

Our final connection used:

```text
TLSv1.3
TLS_AES_256_GCM_SHA384
X25519MLKEM768
```

Important correction:

```text
TLS_AES_256_GCM_SHA384
```

is NOT the actual traffic encryption key. It is the negotiated cryptographic suite.

### Step 4 — Server sends its certificate

The server sends:

```text
server.crt
```

Our output showed:

```text
subject=CN=mtls-server
issuer=CN=Ecommerce-Root-CA
```

The client verifies this using:

```text
ca.crt
```

### Step 5 — Server proves private-key possession

The server has:

```text
server.key
```

TLS uses `CertificateVerify` so the server can prove it possesses the private key corresponding to the public key in the certificate.

Conceptually:

```text
server.key
   ↓
signature over handshake transcript
   ↓
CertificateVerify
   ↓
client verifies with server public key
```

### Step 6 — Server requests the client certificate

This is the mTLS-specific step.

The output showed:

```text
Acceptable client certificate CA names
CN=Ecommerce-Root-CA
```

The meaning is:

> "Client, give me a certificate issued by a CA I trust."

### Step 7 — Client sends its certificate

The client sends:

```text
client.crt
```

The server sees:

```text
Subject: CN=ecommerce-client
Issuer: CN=Ecommerce-Root-CA
```

### Step 8 — Server verifies client certificate

The server checks that:

```text
client.crt
   ↓
signed by Ecommerce-Root-CA
   ↓
Ecommerce-Root-CA is trusted
```

It can also enforce intended usage such as:

```text
TLS Web Client Authentication
```

### Step 9 — Client proves possession of client.key

The client uses:

```text
client.key
```

to produce `CertificateVerify`.

Conceptually:

```text
client.key
   ↓
signature
   ↓
CertificateVerify
   ↓
server verifies
```

This is what prevents somebody from simply copying a public client certificate and pretending to be that client.

### Step 10 — TLS 1.3 key exchange

The handshake establishes shared secret material.

Conceptually:

```text
Client key-share material
        +
Server key-share material
        ↓
Key agreement
        ↓
Shared secret
        ↓
TLS 1.3 key schedule
        ↓
Traffic secrets / traffic keys
```

The actual traffic keys are not displayed in normal `s_client` output.

### Step 11 — Finished

Both sides exchange `Finished`.

Once this succeeds:

```text
Server authenticated
Client authenticated
Handshake authenticated
Traffic keys available
```

### Step 12 — Encrypted application data

The application can now send:

```http
GET / HTTP/1.1
Host: mtls-server
```

TLS protects it before it reaches the network.

The server decrypts the TLS record and gives the HTTP request to the application.

The server responded:

```text
HTTP/1.0 200 ok
```

That is our complete successful mTLS flow.


## 12. Where Exactly Is mTLS "Completed"?

There is normally no literal:

```text
MTLS COMPLETED
```

line.

We establish completion from the sequence:

### Server authentication

```text
Verification: OK
Verify return code: 0 (ok)
```

### Client authentication was requested

```text
Acceptable client certificate CA names
CN=Ecommerce-Root-CA
```

### Client certificate was supplied

```text
Client certificate
Subject: CN=ecommerce-client
Issuer: CN=Ecommerce-Root-CA
```

### Client proved possession of private key

```text
CertificateVerify
```

### TLS handshake completed

```text
Finished
```

### Encrypted session established

```text
New, TLSv1.3
Cipher is TLS_AES_256_GCM_SHA384
```

### Application traffic accepted

```text
HTTP/1.0 200 ok
```

Together these demonstrate successful mTLS.


## 13. Very Important: `Verify return code: 0` Does Not Mean "Both Certificates Were Verified"

When `s_client` says:

```text
Verify return code: 0 (ok)
```

that status primarily represents the client's verification of the **server certificate**.

For example, the client verified:

```text
mtls-server
    ↓
issued by Ecommerce-Root-CA
    ↓
CA is trusted
```

The server's verification of the client certificate happens on the server side.

For our lab, the stronger evidence of client authentication is the combination of:

```text
CertificateRequest
+
Client certificate
+
Client CertificateVerify
+
successful handshake
+
HTTP 200
```

This distinction is important when debugging mTLS.


## 14. Certificate vs Private Key vs CSR

### Certificate

```text
server.crt
client.crt
```

Contains identity, public key, issuer, validity, SAN, EKU and CA signature.

It is generally shareable.

### Private key

```text
server.key
client.key
```

Secret. It proves ownership of the certificate's public key.

### CSR

```text
server.csr
client.csr
```

A request asking a CA to issue a certificate.

### CA

```text
ca.crt
ca.key
```

`ca.crt` is the trust anchor.

`ca.key` is the highly sensitive signing key.


## 15. TLS Encryption: What Happens to the HTTP Request?

Before TLS protection, the application has ordinary HTTP:

```http
GET /api/customers HTTP/1.1
Host: mtls-server
```

TLS then wraps/protects the application data.

Conceptually:

```text
HTTP request
     ↓
TLS record protection
     ↓
AEAD encryption
     ↓
Encrypted TLS Application Data
     ↓
TCP
```

The network therefore does not normally see:

```text
GET /api/customers
```

in plaintext.

It sees encrypted TLS record payload bytes.

### Important correction

The server does **not** decrypt the HTTP request using the Session ID.

The traffic keys are derived from the TLS 1.3 key schedule.

Conceptually:

```text
TLS 1.3 key schedule
        ↓
traffic secrets
        ↓
traffic keys
        ↓
AES-GCM
        ↓
decrypt TLS record
        ↓
HTTP request
```

The client and server independently derive the required traffic keys.


## 16. Understanding `TLS_AES_256_GCM_SHA384`

Break it into:

```text
TLS_AES_256_GCM_SHA384
    |
    +-- AES-256
    |     encryption algorithm/key size
    |
    +-- GCM
    |     authenticated encryption mode
    |
    +-- SHA-384
          hash used by the TLS 1.3 cryptographic/key-schedule construction
```

Do not say:

> "SHA-384 encrypts my HTTP request."

SHA-384 is a hash function.

The application data is protected using the negotiated AEAD cipher, here AES-GCM.


## 17. Session ID, Session Ticket and Traffic Keys Are Different

Our output contained items such as:

```text
Session-ID: ...
Resumption PSK: ...
NewSessionTicket
```

Do not treat any of these as the current HTTP encryption key.

Conceptually:

```text
TLS handshake
     ↓
TLS 1.3 key schedule
     ├── handshake traffic secrets
     ├── client application traffic secrets
     ├── server application traffic secrets
     └── resumption material
```

A `NewSessionTicket` is related to future session resumption.

It is not the current HTTP encryption key.

The Session ID is also not the HTTP decryption key.


## 18. `Early data was not sent`

Our output showed:

```text
Early data was not sent
```

TLS 1.3 can support 0-RTT early data in appropriate resumed sessions.

Our lab did not use it.

For this lab, simply remember:

```text
Early data was not sent
```

is normal and is not an mTLS failure.


## 19. Useful Certificate Inspection Commands

Inspect full certificate:

```bash
openssl x509 -in server.crt -text -noout
```

```bash
openssl x509 -in client.crt -text -noout
```

Subject and issuer:

```bash
openssl x509 -in server.crt -noout -subject -issuer
openssl x509 -in client.crt -noout -subject -issuer
```

Dates:

```bash
openssl x509 -in server.crt -noout -dates
```

SAN:

```bash
openssl x509 -in server.crt -noout -ext subjectAltName
```

EKU:

```bash
openssl x509 -in server.crt -noout -ext extendedKeyUsage
```

Client EKU:

```bash
openssl x509 -in client.crt -noout -ext extendedKeyUsage
```

Certificate chain verification:

```bash
openssl verify -CAfile ca.crt server.crt
openssl verify -CAfile ca.crt client.crt
```


## 20. TLS Debugging Commands

Normal client test:

```bash
openssl s_client \
  -connect 127.0.0.1:9443 \
  -servername mtls-server \
  -cert client.crt \
  -key client.key \
  -CAfile ca.crt
```

Detailed handshake:

```bash
openssl s_client \
  -connect 127.0.0.1:9443 \
  -servername mtls-server \
  -cert client.crt \
  -key client.key \
  -CAfile ca.crt \
  -msg \
  -state
```

Remember the major events:

```text
ClientHello
ServerHello
EncryptedExtensions
Server Certificate
Server CertificateVerify
CertificateRequest
Client Certificate
Client CertificateVerify
Finished
Encrypted Application Data
```

The exact wire ordering includes TLS 1.3 encryption of later handshake records, so do not expect every conceptual event to appear as plaintext in the packet.


## 21. How to See the Encrypted Packets

For a lab, packet capture is useful.

Capture TCP/9443:

```bash
sudo tcpdump -i any -w tls-capture.pcap port 9443
```

Then make a client request.

Stop capture with:

```text
Ctrl+C
```

Open the capture in Wireshark.

You will see TLS records. After the handshake, application data appears as encrypted TLS Application Data rather than readable HTTP.

### Optional TLS key logging

For lab/debugging purposes, OpenSSL can write TLS secrets with:

```bash
openssl s_client \
  -connect 127.0.0.1:9443 \
  -servername mtls-server \
  -cert client.crt \
  -key client.key \
  -CAfile ca.crt \
  -keylogfile tls-keys.log
```

The key-log file is sensitive.

Do not commit it to Git or expose it in production.

With the key log configured in Wireshark, the capture can be decrypted for learning purposes:

```text
Encrypted TLS Application Data
             ↓
        Wireshark uses
        logged secrets
             ↓
        decrypted HTTP
```

This is the practical way to see both the encrypted packet and the original HTTP request in a lab.


## 22. Normal TLS vs mTLS

### Normal TLS

```text
Client
  |
  | ClientHello
  v
Server
  |
  | Server certificate
  v
Client verifies server
  |
  | key exchange
  v
Encrypted traffic
```

### mTLS

```text
Client
  |
  | ClientHello
  v
Server
  |
  | Server certificate
  v
Client verifies server
  |
  | CertificateRequest
  v
Client
  |
  | Client certificate
  | Client CertificateVerify
  v
Server verifies client
  |
  | key exchange
  v
Encrypted traffic
```

The additional identity exchange is the key difference.


## 23. Production Alternative

The OpenSSL commands are excellent for learning and debugging, but an enterprise normally does not manually create every production certificate.

Typical production PKI choices can include:

```text
Enterprise PKI
HashiCorp Vault PKI
AWS Certificate Manager
Azure certificate services
cert-manager
Internal CA
HSM/KMS-backed certificate infrastructure
```

A production architecture may use:

```text
Offline Root CA
      ↓
Intermediate CA
      ↓
Workload / server / client certificates
```

The production system normally also handles:

```text
Issuance
Rotation
Revocation
Distribution
Trust-store management
Key protection
Auditing
```


## 24. How This Maps to Kubernetes/Istio

What we manually built:

```text
CA
 ↓
Server certificate
 ↓
Client certificate
 ↓
Private keys
 ↓
Certificate verification
 ↓
TLS key exchange
 ↓
Encrypted service communication
```

A service mesh automates much of this:

```text
Istio control plane / PKI
        ↓
Workload identity
        ↓
Certificate issuance
        ↓
Certificate distribution
        ↓
Certificate rotation
        ↓
Envoy sidecars
        ↓
mTLS
        ↓
Encrypted service-to-service traffic
```

The underlying TLS concepts are the same.

The difference is operational automation.

This is why understanding the OpenSSL lab first is valuable: Istio mTLS is no longer a black box.


## 25. Troubleshooting Matrix

### Problem: `certificate_required`

Meaning:

```text
Server requires a client certificate
but the client did not provide one.
```

Check:

```bash
-cert client.crt
-key client.key
```

### Problem: server certificate verification failure

Check:

```text
-CAfile ca.crt
server certificate issuer
CA trust
SAN/hostname
certificate validity
```

### Problem: client certificate rejected

Check:

```text
client certificate issuer
server's trusted CA
clientAuth EKU
certificate validity
```

### Problem: certificate and private key do not match

Check the key/certificate pair.

A certificate may be valid while the supplied private key belongs to a different certificate.

### Problem: TLS succeeds but HTTP fails

Then TLS may already be correct.

Debug the application protocol separately.

In our successful test, the final proof was:

```text
TLS established
        ↓
HTTP GET accepted
        ↓
HTTP/1.0 200 ok
```


## 26. Complete Revision Story

When revising this lab, tell yourself this story:

```text
I need trusted identities.
        ↓
I create Ecommerce-Root-CA.
        ↓
The CA has ca.key and ca.crt.
        ↓
The server generates server.key.
        ↓
The server creates server.csr.
        ↓
The CA signs the CSR.
        ↓
The server receives server.crt.
        ↓
The client generates client.key.
        ↓
The client creates client.csr.
        ↓
The CA signs the CSR.
        ↓
The client receives client.crt.
        ↓
Both sides trust ca.crt.
        ↓
The server starts with -Verify 1.
        ↓
ClientHello
        ↓
ServerHello
        ↓
Server sends certificate.
        ↓
Client verifies server certificate.
        ↓
Server sends CertificateRequest.
        ↓
Client sends client certificate.
        ↓
Server verifies client certificate.
        ↓
Client sends CertificateVerify.
        ↓
Server verifies possession of client.key.
        ↓
TLS 1.3 key exchange establishes shared secret material.
        ↓
Traffic keys are derived.
        ↓
Finished messages complete the handshake.
        ↓
HTTP is protected by TLS.
        ↓
Server decrypts the TLS record.
        ↓
Application receives HTTP.
        ↓
HTTP response is encrypted back to the client.
```


## 27. Final Mental Model

```text
                         TRUST
                          |
                  Ecommerce-Root-CA
                          |
             +------------+------------+
             |                         |
             v                         v
       Server Identity           Client Identity
       server.crt                client.crt
       server.key                client.key
             |                         |
             +------------+------------+
                          |
                          v
                  TLS 1.3 HANDSHAKE
                          |
       +------------------+------------------+
       |                                     |
       v                                     v
Server authentication                Client authentication
       |                                     |
       +------------------+------------------+
                          |
                          v
                    Key exchange
                          |
                          v
                   TLS key schedule
                          |
                          v
                    Traffic keys
                          |
                          v
              TLS_AES_256_GCM_SHA384
                          |
                          v
                 Encrypted HTTP
                          |
                          v
                    Application
```

The three questions to remember when debugging mTLS are:

1. **Did the client authenticate the server?**
2. **Did the server authenticate the client?**
3. **Did TLS establish the traffic keys and complete the handshake?**

If all three are true, you have a successful mTLS session.


## 28. One-Line Revision Definitions

```text
CA
    Trusted authority that issues certificates.

Certificate
    Signed identity containing a public key and certificate metadata.

Private key
    Secret used to prove ownership of the certificate's public key.

CSR
    Certificate Signing Request sent to a CA.

SAN
    Subject Alternative Name used for endpoint identity/hostname verification.

EKU
    Extended Key Usage indicating intended certificate purpose.

CertificateRequest
    TLS message in which the server asks the client to authenticate.

CertificateVerify
    Cryptographic proof that an endpoint possesses the private key.

Key exchange
    Mechanism used to establish shared secret material.

Traffic keys
    Symmetric keys derived by the TLS 1.3 key schedule.

AES-GCM
    Authenticated encryption protecting TLS application data.

mTLS
    TLS in which both sides authenticate each other.

Session ticket
    Material used to support future TLS session resumption.

Session ID
    Session-related identifier; it is not the HTTP encryption key.
```
