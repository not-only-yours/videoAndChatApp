# ECS Module

This is example.

This module creates an Elastic Container Service (ECS) cluster for running containerized applications in the Video and Chat Application infrastructure.

## Description

This module provisions an AWS ECS cluster with Fargate capacity providers for serverless container hosting. It includes container insights configuration and proper capacity provider strategies.

## Resources Created

- **AWS ECS Cluster**: Main cluster resource for running containers
- **ECS Cluster Capacity Providers**: Fargate and Fargate Spot configuration
- **Default Capacity Provider Strategy**: Cost-optimized setup with Fargate Spot

## Usage

```hcl
module "ecs-cluster" {
  source      = "./ECS"
  name        = var.ecs_cluster_name
  environment = var.environment
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| name | ECS cluster name | `string` | - | yes |
| environment | Environment name | `string` | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| id | ECS cluster ID |
| name | ECS cluster name |
| arn | ECS cluster ARN |

## Features

- **Fargate Support**: Serverless container hosting
- **Fargate Spot**: Cost-optimized compute with spot instances
- **Container Insights**: Optional monitoring and logging (disabled by default)
- **Capacity Provider Strategy**: Automatic scaling based on demand

## Capacity Providers

The cluster is configured with:
- **FARGATE_SPOT**: Primary capacity provider for cost optimization
- **FARGATE**: Backup capacity provider for guaranteed availability

## Default Strategy

- Base capacity on FARGATE_SPOT
- Weight of 4 for FARGATE_SPOT vs 1 for regular FARGATE
- Provides cost savings while maintaining availability

## Notes

- Container Insights is disabled by default to reduce costs
- Spot instances provide significant cost savings but may be interrupted
- The capacity provider strategy balances cost and availability
- Ensure your applications can handle spot instance interruptions gracefully
