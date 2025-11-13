include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/environment"
}

locals {
  environment = "eks"

  # EKS-specific configuration
  use_eks = true
  use_ecs = false
}

inputs = {
  # Environment specific variables
  environment = "eks"
  description = "EKS-based environment for video and chat application with Kubernetes orchestration."

  # AWS region
  aws_region = "eu-west-1"

  # VPC Configuration
  vpc_CIDR           = "10.3.0.0/16"
  public_subnets     = ["10.3.0.0/24", "10.3.2.0/24"]
  private_subnets    = ["10.3.1.0/24", "10.3.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  # Load Balancer
  arn_certificate_for_HTTPS_connection_to_frontend_ALB = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  DNS = "eks-videochat.pp.ua"

  # ECR
  ecr_name        = "eks-videochat"
  container_image = "latest"

  # EKS Configuration
  cluster_name = "VideoChat-EKS-Cluster"
  node_groups = {
    main = {
      instance_types = ["t3.medium"]
      min_size      = 2
      max_size      = 6
      desired_size  = 2
    }
  }

  # Application Configuration
  app_name         = "videochat-eks"
  container_port   = 3000
  port            = 80

  # Health check
  healthcheck_path = "/"

  # EKS-specific tags
  additional_tags = {
    InfrastructureType = "EKS"
    Orchestration      = "Kubernetes"
  }
}
