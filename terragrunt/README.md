# 🏗️ Video and Chat App Infrastructure

> Terraform infrastructure for the Video and Chat Application, organized with Terragrunt for multi-environment management and deployed on AWS using modern cloud-native services.

[![Terraform](https://img.shields.io/badge/Terraform-1.6+-blue)](https://terraform.io/)
[![Terragrunt](https://img.shields.io/badge/Terragrunt-0.50+-orange)](https://terragrunt.gruntwork.io/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate-orange)](https://aws.amazon.com/fargate/)

## 📋 Overview

This infrastructure deployment provides a scalable, secure, and cost-effective platform for the Video and Chat Application using AWS ECS Fargate, Application Load Balancer, and supporting services.

### 🎯 Key Features

- **Multi-Environment Support** - Development, staging, and production environments
- **Auto-Scaling** - Automatic scaling based on CPU and memory metrics
- **High Availability** - Multi-AZ deployment with health checks
- **Security** - VPC isolation, security groups, and encrypted secrets
- **Cost Optimization** - Fargate Spot instances for cost savings
- **Infrastructure as Code** - Complete infrastructure defined in Terraform

## 🏛️ Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                          Internet                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
              ┌───────▼────────┐
              │ Application    │
              │ Load Balancer  │
              │   (HTTPS)      │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    ┌────▼───┐   ┌────▼───┐   ┌────▼───┐
    │  ECS   │   │  ECS   │   │  ECS   │
    │ Task 1 │   │ Task 2 │   │ Task N │
    │        │   │        │   │        │
    └────────┘   └────────┘   └────────┘
         │            │            │
         └────────────┼────────────┘
                      │
              ┌───────▼────────┐
              │     ECR        │
              │  (Container    │
              │   Registry)    │
              └────────────────┘
```

### AWS Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **ECS Fargate** | Serverless container hosting | Auto-scaling, health checks |
| **Application Load Balancer** | Traffic distribution | HTTPS termination, multi-AZ |
| **ECR** | Container registry | Lifecycle policies, vulnerability scanning |
| **VPC** | Network isolation | Multi-AZ, public/private subnets |
| **Secrets Manager** | Secure configuration | Encrypted application secrets |
| **CloudWatch** | Monitoring & logging | Container logs, metrics |

## 📁 Project Structure

```
terragrunt/
├── 📄 README.md                    # This documentation
├── ⚙️ terragrunt.hcl               # Root Terragrunt configuration
├── 🔧 common.hcl                   # Shared variables and configuration
├── 📦 modules/                     # Terraform modules (kebab-case naming)
│   ├── 🏢 environment/             # Main orchestrating module
│   │   ├── 📄 README.md           # Module documentation
│   │   ├── 🏗️ main.tf             # Infrastructure definition
│   │   ├── 📝 variables.tf        # Input variables
│   │   ├── 🔐 secrets.tf          # Sensitive variables
│   │   └── 📤 outputs.tf          # Output values
│   ├── 🔀 application-load-balancer/ # ALB module
│   ├── 📦 ecr/                     # Container registry module
│   ├── 🖥️ ecs/                     # ECS cluster module
│   ├── 🚀 fargate-cluster/         # Fargate service module
│   ├── 🛡️ security-group/          # Security group module
│   └── 📄 README.md               # Modules overview
└── 🌍 environments/               # Environment-specific configurations
    ├── 🔧 development/             # Development environment
    │   └── terragrunt.hcl
    ├── 🧪 staging/                 # Staging environment
    │   └── terragrunt.hcl
    └── 🚀 production/              # Production environment
        └── terragrunt.hcl
```

## 🚀 Quick Start

### Prerequisites

1. **Install Tools**
   ```bash
   # Install Terragrunt
   brew install terragrunt
   
   # Install Terraform
   brew install terraform
   
   # Install AWS CLI
   brew install awscli
   ```

2. **Configure AWS**
   ```bash
   aws configure
   # Enter your AWS credentials and region
   ```

3. **Setup Infrastructure**
   ```bash
   # Create S3 bucket for state (replace with your bucket name)
   aws s3 mb s3://your-terraform-state-bucket-$(whoami)
   
   # Create DynamoDB table for state locking
   aws dynamodb create-table \
     --table-name terraform-locks \
     --attribute-definitions AttributeName=LockID,AttributeType=S \
     --key-schema AttributeName=LockID,KeyType=HASH \
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

### Deployment Commands

Using the included Makefile for simplified operations:

```bash
# Initialize development environment
make init ENV=development

# Plan changes for staging
make plan ENV=staging

# Apply changes to production
make apply ENV=production

# Destroy development environment (careful!)
make destroy ENV=development
```

### Manual Terragrunt Commands

```bash
# Navigate to environment
cd terragrunt/environments/production

# Standard Terragrunt workflow
terragrunt init
terragrunt plan
terragrunt apply
terragrunt destroy  # Use with caution
```

## 🌍 Environment Configuration

### Development Environment
- **Purpose**: Testing and development
- **Resources**: Minimal for cost optimization
- **Auto-scaling**: 1-3 tasks
- **Network**: `10.2.0.0/16` CIDR

### Staging Environment
- **Purpose**: Pre-production testing
- **Resources**: Production-like configuration
- **Auto-scaling**: 1-5 tasks
- **Network**: `10.1.0.0/16` CIDR

### Production Environment
- **Purpose**: Live application
- **Resources**: Optimized for performance and reliability
- **Auto-scaling**: 2-10 tasks
- **Network**: `10.0.0.0/16` CIDR

## 📊 Module Documentation

| Module | Description | Documentation |
|--------|-------------|---------------|
| **Environment** | Main orchestrating module | [📄 README](modules/environment/README.md) |
| **Application Load Balancer** | HTTPS traffic routing | [📄 README](modules/application-load-balancer/README.md) |
| **ECR** | Container image storage | [📄 README](modules/ecr/README.md) |
| **ECS** | Container orchestration | [📄 README](modules/ecs/README.md) |
| **Fargate Cluster** | Serverless containers | [📄 README](modules/fargate-cluster/README.md) |
| **Security Group** | Network security | [📄 README](modules/security-group/README.md) |

## 🔧 Configuration

### Customization

1. **Update bucket name** in `terragrunt.hcl`:
   ```hcl
   bucket = "your-terraform-state-bucket-${get_env("USER", "default")}"
   ```

2. **Modify environment variables** in `environments/{env}/terragrunt.hcl`

3. **Adjust common settings** in `common.hcl`

4. **Update SSL certificates** and domain names for your setup

### Required Variables

Key variables that need to be configured:

- `arn_certificate_for_HTTPS_connection_to_frontend_ALB` - SSL certificate ARN
- `DNS` - Your domain name
- `ecr_name` - ECR repository name
- `container_image` - Container image tag

## 📈 Monitoring and Logging

### CloudWatch Integration
- **Container Logs**: Centralized logging for all ECS tasks
- **Metrics**: CPU, memory, and custom application metrics
- **Alarms**: Automated scaling triggers

### Health Checks
- **ALB Health Checks**: Application-level health monitoring
- **ECS Health Checks**: Container health monitoring

## 🔐 Security

### Network Security
- **VPC Isolation**: Dedicated VPC with public/private subnets
- **Security Groups**: Restrictive ingress/egress rules
- **HTTPS Only**: SSL termination at load balancer

### Secret Management
- **AWS Secrets Manager**: Encrypted storage of sensitive configuration
- **IAM Roles**: Least privilege access for ECS tasks

## 🛠️ Development Workflow

1. **Make Changes**: Modify Terraform code in modules
2. **Test Locally**: Validate with `terragrunt plan`
3. **Test in Dev**: Deploy to development environment
4. **Review**: Code review and testing
5. **Staging**: Deploy to staging for final validation
6. **Production**: Deploy to production

## 🧪 Testing

```bash
# Format check
make fmt

# Validate all environments
make run-checks

# Plan all environments
make plan-all
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| State lock errors | Check DynamoDB table exists and permissions |
| S3 access denied | Verify bucket exists and AWS credentials |
| Module not found | Run `terragrunt init` in environment directory |
| Certificate errors | Ensure SSL certificate is valid and accessible |

### Helpful Commands

```bash
# Check Terragrunt configuration
terragrunt hclfmt --terragrunt-check

# Debug Terragrunt execution
terragrunt plan --terragrunt-log-level debug

# Show current state
terragrunt show
```

## 🤝 Contributing

1. Follow [Terraform best practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)
2. Test changes in development environment first
3. Update documentation when adding features
4. Use consistent naming conventions (kebab-case for modules)

## 📚 Additional Resources

- [Terragrunt Documentation](https://terragrunt.gruntwork.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [AWS Fargate User Guide](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html)

---

<div align="center">

**Need help?** Check the [troubleshooting section](#-troubleshooting) or [create an issue](https://github.com/your-username/videoAndChatApp/issues)

</div>
