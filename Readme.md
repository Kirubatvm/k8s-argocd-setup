# Configure 3 tier application in kubernetes with argocd.

clone the repo and follow the below steps.

## Install required tools
install below tools in your linux environment.

### Install docker
sudo apt  install docker.io

### Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"  
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl  
kubectl version --client  

### Install Minikube
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64  
chmod +x minikube  
sudo mv minikube /usr/local/bin/  
minikube version  

### Install ArgoCD CLI (optionaly we can configure in argocd ui)
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64  
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd  
rm argocd-linux-amd64  
argocd version --client  

### Start cluster with adequate resources
minikube start --cpus=4 --memory=8192 --driver=docker

### Enable addons
minikube addons enable ingress  
minikube addons enable metrics-server  

### Verify cluster
kubectl cluster-info  
kubectl get nodes  


## Containerize our application
Run below commands to build and push our images  

cd app-source/services/backend  
docker build -t dockerhub-id-image-name:version .  
docker push dockerhub-id-image-name:version  

cd app-source/services/frontend  
docker build -t dockerhub-id-image-name:version .  
docker push dockerhub-id-image-name:version  

### Update maifest files.
Update backend-deployment.yaml and frontend-deployment.yaml with the image name of your dockerhub

## Argocd Deployment
Run below command to configure your repo with argocd  

kubectl create namespace argocd  
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml  

Use below command to portforward from minikube to local and access ui  
kubectl port-forward -n argocd --address 0.0.0.0 svc/argocd-server 8080:443  

To get password use below command  
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d  

## Application Deployment
Run below command to deploy our application.

kubectl apply -f k8s-gitops-config/argocd-app.yaml