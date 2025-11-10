# FargateCluster Module

This is example.

This module creates a complete Fargate service configuration including ECS task definitions, services, auto-scaling, and monitoring for the Video and Chat Application.

## Description

This module provisions a comprehensive Fargate setup with ECS tasks, services, auto-scaling policies, CloudWatch logging, and target groups for load balancer integration.

## Resources Created

- **ECS Task Definition**: Container configuration and resource allocation
- **ECS Service**: Service management and deployment configuration
- **CloudWatch Log Group**: Centralized logging for containers
- **IAM Roles and Policies**: Permissions for task execution and container operations
- **Application Load Balancer Target Group**: Integration with ALB
- **Auto Scaling**: Automatic scaling based on metrics
- **CloudWatch Alarms**: Monitoring and alerting

## Usage

```hcl
module "fargate" {
  source              = "./FargateCluster"
  
  ecs_cluster_name    = module.ecs-cluster.name
  environment         = var.environment
  autoscaling_enabled = true

  name                     = "ecs-fargate"
  vpc_id                   = module.vpc.vpc_id
  private_subnet_ids       = module.vpc.private_subnets
  cluster_id               = module.ecs-cluster.id
  secrets_arns             = [aws_secretsmanager_secret.dns-secrets.arn]
  source_security_group_id = module.frontend-alb.sg_id

  task_container_image   = "${module.ecr.repository_url}:${var.container_image}"
  task_container_port    = var.container_port
  task_host_port         = var.port
  
  # Auto-scaling configuration
  scale_target_max_capacity = 10
  scale_target_min_capacity = 1
  
  # Container resources
  task_definition_cpu    = 256
  task_definition_memory = 512
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| name | Service name | `string` | - | yes |
| environment | Environment name | `string` | - | yes |
| ecs_cluster_name | ECS cluster name | `string` | - | yes |
| cluster_id | ECS cluster ID | `string` | - | yes |
| vpc_id | VPC ID | `string` | - | yes |
| private_subnet_ids | Private subnet IDs | `list(string)` | - | yes |
| task_container_image | Container image URL | `string` | - | yes |
| task_container_port | Container port | `number` | `3000` | no |
| task_host_port | Host port | `number` | `80` | no |
| autoscaling_enabled | Enable auto-scaling | `bool` | `true` | no |
| task_definition_cpu | CPU units | `number` | `256` | no |
| task_definition_memory | Memory (MB) | `number` | `512` | no |

## Outputs

| Name | Description |
|------|-------------|
| target_group_arn | Target group ARN for ALB |
| service_name | ECS service name |
| task_definition_arn | Task definition ARN |
| log_group_name | CloudWatch log group name |

## Features

- **Auto Scaling**: Automatic scaling based on CPU and memory metrics
- **Health Checks**: Application and ALB health checks
- **Service Discovery**: Integration with AWS service discovery
- **Secrets Management**: Secure handling of environment variables
- **Logging**: Centralized logging with CloudWatch
- **Security**: Proper IAM roles and security group configuration

## Auto Scaling Policies

The module includes:
- **Scale Up Policy**: Increases capacity when CPU > 80%
- **Scale Down Policy**: Decreases capacity when CPU < 10%
- **CloudWatch Alarms**: Triggers for scaling actions

## Container Configuration

- **Platform Version**: Fargate 1.4.0 for improved performance
- **Network Mode**: awsvpc for enhanced networking
- **CPU/Memory**: Configurable resource allocation
- **Environment Variables**: Support for secrets and regular variables

## Notes

- Ensure container image is pushed to ECR before deployment
- Configure health check endpoints in your application
- Monitor CloudWatch logs for application debugging
- Auto-scaling policies can be customized based on application needs
- Use secrets manager for sensitive configuration data
