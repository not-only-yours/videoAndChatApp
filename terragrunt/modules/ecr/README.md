# ECR Module

This is example.

This module creates an Elastic Container Registry (ECR) repository for storing Docker images of the Video and Chat Application.

## Description

This module provisions an AWS ECR repository with lifecycle policies to manage image retention and automatic cleanup of old images.

## Resources Created

- **AWS ECR Repository**: Container image repository
- **ECR Lifecycle Policy**: Automatic cleanup of old images
- **ECR Repository Policy**: Access control for the repository

## Usage

```hcl
module "ecr" {
  source             = "./ECR"
  name               = var.ecr_name
  environment        = var.environment
  max_images_in_repo = 5
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| name | ECR repository name | `string` | - | yes |
| environment | Environment name | `string` | - | yes |
| max_images_in_repo | Maximum images to keep | `number` | `5` | no |

## Outputs

| Name | Description |
|------|-------------|
| repository_url | ECR repository URL |
| arn | ECR repository ARN |
| name | ECR repository name |

## Features

- **Automatic Image Cleanup**: Lifecycle policy to manage image retention
- **Security Scanning**: Optional image vulnerability scanning
- **Force Delete**: Allows deletion even with images present
- **Tagging**: Consistent resource tagging

## Lifecycle Policy

The module includes a lifecycle policy that:
- Keeps the specified number of most recent images
- Automatically deletes older images
- Helps control storage costs

## Notes

- Images are automatically cleaned up based on the lifecycle policy
- Repository can be force-deleted even with images present
- Scan on push is disabled by default but can be enabled if needed
- Ensure proper IAM permissions for pushing/pulling images
