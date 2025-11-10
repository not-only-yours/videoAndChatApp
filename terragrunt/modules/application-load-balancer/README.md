# Application Load Balancer Module

This is example.

This module creates an Application Load Balancer (ALB) for the Video and Chat Application with HTTPS support and proper security group configuration.

## Description

This module provisions an AWS Application Load Balancer that distributes incoming traffic across multiple targets in the ECS service. It includes SSL/TLS termination and security group configuration.

## Resources Created

- **AWS Application Load Balancer**: Main load balancer resource
- **ALB Listener**: HTTP and HTTPS listeners
- **ALB Target Group**: For routing traffic to ECS tasks
- **Security Group**: Network security for the load balancer

## Usage

```hcl
module "frontend-alb" {
  source           = "./ApplicationLoadBalancer"
  name             = "frontend-alb"
  is_internal      = false
  subnets          = module.vpc.public_subnets
  certificate_arn  = var.certificate_arn
  target_group_arn = module.fargate.target_group_arn[0]
  vpc_id           = module.vpc.vpc_id
  environment      = var.environment
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| name | Name for the load balancer | `string` | - | yes |
| environment | Environment name | `string` | - | yes |
| is_internal | Whether ALB is internal | `bool` | `false` | no |
| subnets | List of subnet IDs | `list(string)` | - | yes |
| certificate_arn | SSL certificate ARN | `string` | - | yes |
| target_group_arn | Target group ARN | `string` | - | yes |
| vpc_id | VPC ID | `string` | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| dns_name | ALB DNS name |
| zone_id | ALB zone ID |
| sg_id | Security group ID |
| arn | ALB ARN |

## Features

- **SSL/TLS Termination**: HTTPS support with certificate management
- **Health Checks**: Configurable health check endpoints
- **Security Groups**: Proper network security configuration
- **Multi-AZ**: High availability across multiple availability zones

## Notes

- Ensure the certificate ARN is valid and matches your domain
- Configure security groups to allow appropriate traffic
- Health check path should be configured properly in the target application
