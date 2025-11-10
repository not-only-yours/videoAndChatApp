terragrunt_version_constraint = ">= 0.38"
terraform_version_constraint  = ">= 1.0"

# Read common variables
locals {
  common_vars = read_terragrunt_config("common.hcl")
}

# Generate provider and terraform blocks
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.common_tags
  }
}
EOF
}

# Configure remote state
remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket         = "your-terraform-state-bucket-${get_env("USER", "default")}" # Update this with your actual bucket name
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = local.common_vars.locals.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Global inputs that will be passed to all modules
inputs = {
  # Infrastructure description for video and chat application
  description = "Infrastructure for video and chat application deployed on AWS using ECS Fargate."

  # Common configuration from common.hcl
  common_tags      = local.common_vars.locals.common_tags
  aws_region       = local.common_vars.locals.aws_region
  container_port   = local.common_vars.locals.container_port
  port            = local.common_vars.locals.port
  healthcheck_path = local.common_vars.locals.healthcheck_path
}
