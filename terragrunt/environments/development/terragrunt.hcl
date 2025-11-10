include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/environment"
}

inputs = {
  # Environment specific variables
  environment = "development"

  # Development environment for video and chat application
  description = "Development environment for video and chat application with optimized resources for testing and development."

  # AWS region
  aws_region = "eu-west-1"

  # VPC Configuration (smaller CIDR for dev)
  vpc_CIDR           = "10.2.0.0/16"
  public_subnets     = ["10.2.0.0/24", "10.2.2.0/24"]
  private_subnets    = ["10.2.1.0/24", "10.2.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  # Load Balancer
  arn_certificate_for_HTTPS_connection_to_frontend_ALB = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  DNS = "dev-monitoring-ops.pp.ua"

  # ECR
  ecr_name        = "dev-not-only-yoursvideochat"
  container_image = "dev"

  # ECS (smaller instance sizes for dev)
  ecs_cluster_name = "DevCluster"
  port             = 80
  container_port   = 3000

  # Secrets
  dns_secret_name = "REACT_APP_VideoChat_Dev"

  # Health check
  healthcheck_path = "/"
}
