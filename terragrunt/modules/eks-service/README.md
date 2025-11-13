# EKS Service Module

This Terraform module deploys the video chat application to an Amazon EKS (Elastic Kubernetes Service) cluster.

## Features

- 🚀 **Full Kubernetes Deployment**: Complete deployment with Deployment, Service, and Ingress
- 🔒 **Security Best Practices**: Non-root containers, security contexts, and resource limits
- 📈 **Auto-scaling**: Horizontal Pod Autoscaler (HPA) with CPU and memory metrics
- 🌐 **Load Balancer Integration**: AWS Application Load Balancer through Kubernetes Ingress
- 🔐 **SSL Support**: Automatic HTTPS configuration with ACM certificates
- 📊 **Health Checks**: Liveness and readiness probes for application health
- 🏗️ **Resource Management**: CPU and memory requests/limits for optimal resource usage
- 🔧 **Environment Configuration**: ConfigMaps and Secrets for application configuration

## Usage

### Basic Usage

```hcl
module "videochat_service" {
  source = "../../modules/eks-service"
  
  name                = "videochat-app"
  namespace           = "videochat"
  image               = "your-ecr-repo"
  image_version       = "v1.0.0"
  environment         = "production"
  replicas            = 3
  
  dns_domain          = "videochat.example.com"
  certificate_arn     = "arn:aws:acm:region:account:certificate/cert-id"
  
  environment_variables = {
    NODE_ENV = "production"
    API_URL  = "https://api.example.com"
  }
  
  secrets = {
    DATABASE_PASSWORD = "your-secret-password"
    JWT_SECRET       = "your-jwt-secret"
  }
}
```

### With ECR Repository

```hcl
module "videochat_service" {
  source = "../../modules/eks-service"
  
  name               = "videochat-app"
  ecr_repository_url = "123456789012.dkr.ecr.eu-west-1.amazonaws.com/videochat"
  image_version      = "latest"
  
  resource_limits = {
    cpu    = "1000m"
    memory = "1Gi"
  }
  
  resource_requests = {
    cpu    = "500m"
    memory = "512Mi"
  }
}
```

## Module Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| enabled | Enable or disable the deployment | `bool` | `true` | no |
| name | Name of the application deployment | `string` | `"videochat-app"` | no |
| namespace | Kubernetes namespace | `string` | `"videochat"` | no |
| image | Docker image name | `string` | `"not-only-yoursvideochat"` | no |
| image_version | Image version/tag | `string` | `"latest"` | no |
| port | Application port | `number` | `3000` | no |
| replicas | Number of replicas | `number` | `2` | no |
| environment | Environment name | `string` | `"development"` | no |
| ecr_repository_url | ECR repository URL | `string` | `""` | no |
| dns_domain | DNS domain for ingress | `string` | `""` | no |
| certificate_arn | SSL certificate ARN | `string` | `""` | no |
| health_check_path | Health check endpoint | `string` | `"/"` | no |
| resource_limits | Resource limits | `object` | `{cpu="500m", memory="512Mi"}` | no |
| resource_requests | Resource requests | `object` | `{cpu="250m", memory="256Mi"}` | no |
| environment_variables | Environment variables | `map(string)` | `{}` | no |
| secrets | Secret environment variables | `map(string)` | `{}` | no |

## Module Outputs

| Name | Description |
|------|-------------|
| namespace | Kubernetes namespace |
| service_name | Service name |
| deployment_name | Deployment name |
| ingress_name | Ingress name |

## Prerequisites

1. **EKS Cluster**: You need an existing EKS cluster
2. **AWS Load Balancer Controller**: Required for ALB ingress functionality
3. **Metrics Server**: Required for HPA functionality
4. **ECR Access**: If using ECR, ensure proper IAM permissions

## Kubernetes Resources Created

1. **Namespace**: Isolated environment for the application
2. **ConfigMap**: Non-sensitive configuration data
3. **Secret**: Sensitive configuration data
4. **Deployment**: Application pods with rolling update strategy
5. **Service**: Internal load balancer for pod communication
6. **Ingress**: External access through AWS Application Load Balancer
7. **HorizontalPodAutoscaler**: Automatic scaling based on metrics

## Security Features

- Non-root container execution
- Read-only root filesystem option
- Security contexts with least privilege
- Network policies ready
- Resource limits to prevent resource exhaustion
- Secrets management for sensitive data

## Auto-scaling

The module includes automatic horizontal pod autoscaling based on:
- CPU utilization (70% threshold)
- Memory utilization (80% threshold)
- Custom scaling policies for gradual scale-up/down

Scale limits:
- **Development**: 2-5 pods
- **Production**: 2-10 pods

## Monitoring & Health Checks

- **Liveness Probe**: Ensures containers are running properly
- **Readiness Probe**: Ensures containers are ready to receive traffic
- **Prometheus Annotations**: Ready for Prometheus metrics scraping

## Example Terragrunt Configuration

```hcl
# terragrunt.hcl
include "root" {
  path = find_in_parent_folders()
}

dependency "cluster" {
  config_path = "../eks-cluster"
}

dependency "data" {
  config_path = "../data"
}

terraform {
  source = "../../modules/eks-service"
}

inputs = {
  name                = "videochat-${local.environment}"
  namespace           = "videochat-${local.environment}"
  environment         = local.environment
  ecr_repository_url  = dependency.data.outputs.ecr_repository_url
  image_version       = "v1.2.3"
  
  dns_domain      = local.environment == "production" ? "videochat.example.com" : "${local.environment}-videochat.example.com"
  certificate_arn = local.certificate_arn
  
  replicas = local.environment == "production" ? 5 : 2
  
  resource_limits = local.environment == "production" ? {
    cpu    = "1000m"
    memory = "1Gi"
  } : {
    cpu    = "500m"
    memory = "512Mi"
  }
  
  environment_variables = {
    NODE_ENV = local.environment
    LOG_LEVEL = local.environment == "production" ? "info" : "debug"
  }
  
  secrets = {
    DATABASE_URL = dependency.database.outputs.connection_string
    JWT_SECRET   = "your-jwt-secret"
  }
}
```

## Troubleshooting

### Common Issues

1. **Pods not starting**: Check resource limits and image availability
2. **Ingress not working**: Verify AWS Load Balancer Controller is installed
3. **Health checks failing**: Ensure your application responds to health check path
4. **HPA not scaling**: Verify Metrics Server is running in the cluster

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n videochat

# Check deployment status
kubectl describe deployment videochat-app -n videochat

# Check ingress status
kubectl describe ingress videochat-app-ingress -n videochat

# Check HPA status
kubectl get hpa -n videochat

# View pod logs
kubectl logs -f deployment/videochat-app -n videochat
```
