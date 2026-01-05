# Configure 3-Tier Application in Kubernetes with ArgoCD

Clone this repository and follow the steps below.

## Install Required Tools

Install the following tools in your Linux environment (note: these instructions are for Linux; adapt for other OS as needed).

### Install Docker
```bash
sudo apt install docker.io
```

### Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```

### Install Minikube
```bash
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube
sudo mv minikube /usr/local/bin/
minikube version
```

### Install ArgoCD CLI (Optional: You can configure via ArgoCD UI)
```bash
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
argocd version --client
```

### Start Cluster with Adequate Resources
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

### Enable Addons
```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

### Verify Cluster
```bash
kubectl cluster-info
kubectl get nodes
```

## Containerize the Application

Run the following commands to build and push images.

### Backend Service
```bash
cd app-source/services/backend
docker build -t dockerhub-id-image-name:version .
docker push dockerhub-id-image-name:version
```

### Frontend Service
```bash
cd app-source/services/frontend
docker build -t dockerhub-id-image-name:version .
docker push dockerhub-id-image-name:version
```

### Update Manifest Files
Update `backend-deployment.yaml` and `frontend-deployment.yaml` with your Docker Hub image names.

## ArgoCD Deployment

Run the following commands to configure your repository with ArgoCD.

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Use the following command to port-forward from Minikube to local and access the UI:
```bash
kubectl port-forward -n argocd --address 0.0.0.0 svc/argocd-server 8080:443
```

To get the password, use:
```bash
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```

## Application Deployment

Run the following command to deploy the application:
```bash
kubectl apply -f k8s-gitops-config/argocd-app.yaml
```