# SecurityGroup Module

This is example.

This module creates AWS Security Groups with configurable ingress and egress rules for the Video and Chat Application infrastructure components.

## Description

This module provides a flexible way to create security groups with custom ingress and egress rules. It supports both CIDR-based and security group-based rules, with options for allowing all traffic or specific configurations.

## Resources Created

- **AWS Security Group**: Main security group resource
- **Security Group Rules**: Ingress and egress rules based on configuration
  - CIDR-based ingress rules
  - Security group-based ingress rules
  - Egress rules for outbound traffic

## Usage

```hcl
# Example: ALB Security Group
module "balancer-sg" {
  source = "../SecurityGroup"
  name   = "alb-sg"
  vpc_id = var.vpc_id
  environment = var.environment
  
  ingress_cidr_blocks = [
    {
      description = "HTTP"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      description = "HTTPS"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

# Example: ECS Service Security Group
module "ecs-sg" {
  source = "../SecurityGroup"
  name   = "ecs-sg"
  vpc_id = var.vpc_id
  environment = var.environment
  
  ingress_security_group_rules = [
    {
      description              = "ALB to ECS"
      from_port               = 3000
      to_port                 = 3000
      protocol                = "tcp"
      source_security_group_id = module.alb-sg.id
    }
  ]
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| name | Security group name | `string` | - | yes |
| environment | Environment name | `string` | - | yes |
| vpc_id | VPC ID | `string` | - | yes |
| allow_all_connection | Allow all inbound traffic | `bool` | `false` | no |
| ingress_cidr_blocks | CIDR-based ingress rules | `list(object)` | `[]` | no |
| ingress_security_group_rules | SG-based ingress rules | `list(object)` | `[]` | no |
| egress_cidr_blocks | CIDR-based egress rules | `list(object)` | `[]` | no |

## Ingress CIDR Block Structure

```hcl
ingress_cidr_blocks = [
  {
    description = "Rule description"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
]
```

## Ingress Security Group Rule Structure

```hcl
ingress_security_group_rules = [
  {
    description              = "Rule description"
    from_port               = 3000
    to_port                 = 3000
    protocol                = "tcp"
    source_security_group_id = "sg-xxxxxxxxx"
  }
]
```

## Outputs

| Name | Description |
|------|-------------|
| id | Security group ID |
| arn | Security group ARN |
| name | Security group name |

## Features

- **Flexible Rule Configuration**: Support for multiple types of ingress/egress rules
- **CIDR and Security Group Sources**: Rules can reference IP ranges or other security groups
- **Environment Tagging**: Consistent tagging across environments
- **Allow All Override**: Option to allow all traffic for testing environments

## Common Use Cases

1. **Load Balancer Security Group**: Allow HTTP/HTTPS from internet
2. **ECS Service Security Group**: Allow traffic from load balancer only
3. **Database Security Group**: Allow traffic from application tier only
4. **Bastion Security Group**: Allow SSH from specific IP ranges

## Security Best Practices

- Use specific port ranges instead of allowing all traffic
- Reference security groups instead of CIDR blocks when possible
- Implement least privilege access principles
- Regularly review and audit security group rules
- Use descriptive names and descriptions for rules

## Notes

- Rules are created using for_each loops for flexibility
- The module supports both ingress and egress rule configuration
- Default behavior denies all traffic unless explicitly allowed
- Security group names are prefixed with environment for clarity
