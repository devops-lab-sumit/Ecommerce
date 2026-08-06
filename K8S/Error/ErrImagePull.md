Your Pods are not starting because Kubernetes cannot pull the Docker image.

From your screenshot:

```text
NAME                                      READY   STATUS          RESTARTS
customer-api-deployment-5f6dc75848-sd5gp  0/1     ErrImagePull    0
customer-api-deployment-5f6dc75848-tpknp  0/1     ErrImagePull    0
```

`ErrImagePull` means **the kubelet tried to download the image but failed**.

---

## Step 1: Get the exact error

Run:

```bash
kubectl describe pod customer-api-deployment-5f6dc75848-sd5gp
```

or

```bash
kubectl describe pod customer-api-deployment-5f6dc75848-tpknp
```

Scroll to the **Events** section at the bottom.

You'll see something like:

```text
Failed to pull image "sumit/customer-api:latest"
```

or

```text
pull access denied
```

or

```text
manifest unknown
```

or

```text
unauthorized
```

That message tells us the real reason.

---

## Step 2: Check your Deployment image

Run:

```bash
kubectl get deployment customer-api-deployment -o yaml
```

or simply

```bash
kubectl describe deployment customer-api-deployment
```

Look for

```yaml
image:
```

Example:

```yaml
image: sumitraj/customer-api:latest
```

---

## Step 3: Verify the image exists locally

Since you're using **k3d**, it can use either:

* images inside the k3d node
* or images from Docker Hub

Check:

```bash
docker images
```

Do you see

```text
customer-api
```

or

```text
sumitraj/customer-api
```

?

---

## Step 4: If you're pulling from Docker Hub

Verify:

* repository name is correct
* tag is correct
* image is public **or**
* you've created an `imagePullSecret`

---

## Step 5: If using a local image in k3d

If you built locally:

```bash
docker build -t customer-api:latest .
```

then you must import it into k3d:

```bash
k3d image import customer-api:latest -c <cluster-name>
```

Otherwise Kubernetes cannot see the image.

---

## Step 6: If using Docker Hub

Verify:

```bash
docker pull yourdockerhub/customer-api:latest
```

If this command fails, Kubernetes will fail too.

---

# I need these outputs

Please paste the outputs of these commands:

```bash
kubectl describe pod customer-api-deployment-5f6dc75848-sd5gp
```

```bash
kubectl get deployment customer-api-deployment -o yaml
```

```bash
docker images
```

Also tell me:

* Are you using **Docker Hub images**, or
* Did you build the image locally and deploy to **k3d**?

Once I see the **Events** section from `kubectl describe pod`, I'll be able to pinpoint the exact cause in a minute.


sumit@DESKTOP-3C06N9S:~/MyFolder/Ecommerce$ kubectl describe pod customer-api-deployment-5f6dc75848-sd5gp
Name:             customer-api-deployment-5f6dc75848-sd5gp
Namespace:        mydemok8s
Priority:         0
Service Account:  default
Node:             k3d-demo-agent-0/172.19.0.3
Start Time:       Wed, 05 Aug 2026 15:50:33 +0000
Labels:           app=customer-api
                  env=non-prod
                  pod-template-hash=5f6dc75848
Annotations:      <none>
Status:           Pending
IP:               10.42.2.25
IPs:
  IP:           10.42.2.25
Controlled By:  ReplicaSet/customer-api-deployment-5f6dc75848
Containers:
  customer-api:
    Container ID:   
    Image:          sumit198/customer-api:1.0.1
    Image ID:       
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Waiting
      Reason:       ImagePullBackOff
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-4sbf6 (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True 
  Initialized                 True 
  Ready                       False 
  ContainersReady             False 
  PodScheduled                True 
Volumes:
  kube-api-access-4sbf6:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason                           Age                From               Message
  ----     ------                           ----               ----               -------
  Normal   Scheduled                        95s                default-scheduler  Successfully assigned mydemok8s/customer-api-deployment-5f6dc75848-sd5gp to k3d-demo-agent-0
  Normal   BackOff                          15s (x5 over 93s)  kubelet            spec.containers{customer-api}: Back-off pulling image "sumit198/customer-api:1.0.1"
  Warning  Failed                           15s (x5 over 93s)  kubelet            spec.containers{customer-api}: Error: ImagePullBackOff
  Warning  FailedToRetrieveImagePullSecret  4s (x9 over 95s)   kubelet            Unable to retrieve some image pull secrets (regcred); attempting to pull the image may not succeed.
  Normal   Pulling                          4s (x4 over 95s)   kubelet            spec.containers{customer-api}: Pulling image "sumit198/customer-api:1.0.1"
  Warning  Failed                           3s (x4 over 93s)   kubelet            spec.containers{customer-api}: Failed to pull image "sumit198/customer-api:1.0.1": failed to pull and unpack image "docker.io/sumit198/customer-api:1.0.1": failed to resolve reference "docker.io/sumit198/customer-api:1.0.1": pull access denied, repository does not exist or may require authorization: server message: insufficient_scope: authorization failed
  Warning  Failed                           3s (x4 over 93s)   kubelet            spec.containers{customer-api}: Error: ErrImagePull
sumit@DESKTOP-3C06N9S:~/MyFolder/Ecommerce$ kubectl get deployment customer-api-deployment -o yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"labels":{"app":"customer-api","env":"non-prod"},"name":"customer-api-deployment","namespace":"mydemok8s"},"spec":{"replicas":2,"selector":{"matchLabels":{"app":"customer-api","env":"non-prod"}},"template":{"metadata":{"labels":{"app":"customer-api","env":"non-prod"}},"spec":{"containers":[{"image":"sumit198/customer-api:1.0.1","imagePullPolicy":"Always","name":"customer-api","ports":[{"containerPort":80}]}],"imagePullSecrets":[{"name":"regcred"}]}}}}
  creationTimestamp: "2026-08-05T15:50:33Z"
  generation: 1
  labels:
    app: customer-api
    env: non-prod
  name: customer-api-deployment
  namespace: mydemok8s
  resourceVersion: "35864"
  uid: 470daccc-a8e1-4cd8-988a-6d6d4ac6c4d4
spec:
  progressDeadlineSeconds: 600
  replicas: 2
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: customer-api
      env: non-prod
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: customer-api
        env: non-prod
    spec:
      containers:
      - image: sumit198/customer-api:1.0.1
        imagePullPolicy: Always
        name: customer-api
        ports:
        - containerPort: 80
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      imagePullSecrets:
      - name: regcred
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
status:
  conditions:
  - lastTransitionTime: "2026-08-05T15:50:33Z"
    lastUpdateTime: "2026-08-05T15:50:33Z"
    message: Deployment does not have minimum availability.
    reason: MinimumReplicasUnavailable
    status: "False"
    type: Available
  - lastTransitionTime: "2026-08-05T15:50:33Z"
    lastUpdateTime: "2026-08-05T15:50:33Z"
    message: ReplicaSet "customer-api-deployment-5f6dc75848" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  observedGeneration: 1
  replicas: 2
  terminatingReplicas: 0
  unavailableReplicas: 2
  updatedReplicas: 2
sumit@DESKTOP-3C06N9S:~/MyFolder/Ecommerce$ 