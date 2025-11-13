# Example Terragrunt configuration for EKS service deployment
# This file shows how to use the eks-service module

include "root" {
  path = find_in_parent_folders()
}

# Dependencies - adjust paths according to your setup
dependency "eks_cluster" {
  config_path = "../eks-cluster"
  mock_outputs = {
    cluster_endpoint                   = "https://mock-cluster.eks.eu-west-1.amazonaws.com"
    cluster_name                      = "mock-cluster"
    cluster_certificate_authority_data = "LS0tLS1CRUdJTi..."
  }
}

dependency "data" {
  config_path = "../data"
  mock_outputs = {
    ecr_repository_url    = "123456789012.dkr.ecr.eu-west-1.amazonaws.com/videochat"
    iam_assumed_role_arn  = "arn:aws:iam::123456789012:role/eks-role"
  }
}

# Include the common provider configuration
include "kubernetes_provider" {
  path = find_in_parent_folders("common.hcl")
}

locals {
  # Environment-specific configuration
  environment = "development"  # Change to "staging" or "production" as needed

  # Environment-specific settings
  app_config = {
    development = {
      replicas = 1
      cpu_limit = "500m"
      memory_limit = "512Mi"
      cpu_request = "100m"
      memory_request = "128Mi"
      dns_prefix = "dev-"
    }
    staging = {
      replicas = 2
      cpu_limit = "1000m"
      memory_limit = "1Gi"
      cpu_request = "250m"
      memory_request = "256Mi"
      dns_prefix = "staging-"
    }
    production = {
      replicas = 3
      cpu_limit = "2000m"
      memory_limit = "2Gi"
      cpu_request = "500m"
      memory_request = "512Mi"
      dns_prefix = ""
    }
  }

  current_config = local.app_config[local.environment]
}

terraform {
  source = "../../modules/eks-service"
}

inputs = {
  # Basic configuration
  enabled               = true
  name                  = "videochat-app-${local.environment}"
  namespace             = "videochat-${local.environment}"
  environment           = local.environment

  # Image configuration
  ecr_repository_url    = dependency.data.outputs.ecr_repository_url
  image_version         = "latest"  # Use specific version tags in production

  # Scaling configuration
  replicas              = local.current_config.replicas

  # Resource configuration
  resource_limits = {
    cpu    = local.current_config.cpu_limit
    memory = local.current_config.memory_limit
  }

  resource_requests = {
    cpu    = local.current_config.cpu_request
    memory = local.current_config.memory_request
  }

  # DNS and SSL configuration
  dns_domain            = "${local.current_config.dns_prefix}videochat.pp.ua"  # Adjust domain
  certificate_arn       = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  health_check_path     = "/"

  # Application configuration
  environment_variables = {
    NODE_ENV              = local.environment
    PORT                  = "3000"
    LOG_LEVEL            = local.environment == "production" ? "info" : "debug"
    # Add more environment-specific variables here
  }

  # Sensitive configuration (use AWS Secrets Manager or similar in production)
  secrets = {
    # Example secrets - replace with actual secret management
    # JWT_SECRET          = "your-jwt-secret"
    # DATABASE_PASSWORD   = "your-database-password"
    # API_KEY            = "your-api-key"
  }
}

# Optional: Add additional dependencies if needed
# dependency "rds" {
#   config_path = "../rds"
#   mock_outputs = {
#     connection_string = "postgresql://user:pass@host:5432/db"
#   }
# }
