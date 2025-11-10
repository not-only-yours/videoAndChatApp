# Environment Module

This is example.

This module defines the complete infrastructure environment for the Video and Chat Application, including VPC, ECS cluster, ECR repository, load balancer, and all related resources.

## Description

This module orchestrates all the infrastructure components required to run the video and chat application in a specific environment (development, staging, or production).

## Resources Created

- **VPC**: Virtual Private Cloud with public and private subnets
- **ECS Cluster**: Elastic Container Service cluster for running containers
- **ECR Repository**: Elastic Container Registry for storing Docker images
- **Application Load Balancer**: For distributing traffic to the application
- **Fargate Service**: Serverless container hosting
- **Security Groups**: Network security configurations
- **Secrets Manager**: For managing sensitive configuration

## Usage

This module is designed to be used with Terragrunt from the environment-specific configurations:

```hcl
terraform {
  source = "../../modules/environment"
}

inputs = {
  environment = "development"
  description = "This is example."
  aws_region = "eu-west-1"
  
  # VPC Configuration
  vpc_CIDR           = "10.2.0.0/16"
  public_subnets     = ["10.2.0.0/24", "10.2.2.0/24"]
  private_subnets    = ["10.2.1.0/24", "10.2.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]
  
  # Application Configuration
  ecr_name        = "dev-videochat"
  container_image = "latest"
  ecs_cluster_name = "DevCluster"
  
  # Other configuration...
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| environment | Environment name (dev/staging/prod) | `string` | - | yes |
| description | Environment description | `string` | "This is example." | no |
| aws_region | AWS region | `string` | "eu-west-1" | no |
| vpc_CIDR | VPC CIDR block | `string` | "10.0.0.0/16" | no |
| availability_zones | List of AZs | `list(string)` | - | yes |
| public_subnets | Public subnet CIDRs | `list(string)` | - | yes |
| private_subnets | Private subnet CIDRs | `list(string)` | - | yes |
| ecr_name | ECR repository name | `string` | - | yes |
| container_image | Container image tag | `string` | "latest" | no |
| ecs_cluster_name | ECS cluster name | `string` | - | yes |

## Outputs

The module provides various outputs that can be used by other modules or for reference:

- VPC ID and subnet IDs
- ECS cluster information
- ECR repository URL
- Load balancer DNS name and zone ID
- Security group IDs

## Dependencies

This module uses the following sub-modules:
- `../ApplicationLoadBalancer`
- `../ECR`
- `../ECS`
- `../FargateCluster`
- `../SecurityGroup`

## Notes

- Ensure all sub-modules are properly configured
- Update certificate ARNs for your domain
- Adjust CIDR blocks to avoid conflicts
- Configure secrets manager with appropriate values
