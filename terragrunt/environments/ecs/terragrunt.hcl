include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/environment"
}

locals {
  environment = "ecs"

  # ECS-specific configuration
  use_eks = false
  use_ecs = true
}

inputs = {
  # Environment specific variables
  environment = "ecs"
  description = "ECS Fargate environment for video and chat application with serverless containers."

  # AWS region
  aws_region = "eu-west-1"

  # VPC Configuration
  vpc_CIDR           = "10.4.0.0/16"
  public_subnets     = ["10.4.0.0/24", "10.4.2.0/24"]
  private_subnets    = ["10.4.1.0/24", "10.4.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  # Load Balancer
  arn_certificate_for_HTTPS_connection_to_frontend_ALB = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  DNS = "ecs-videochat.pp.ua"

  # ECR
  ecr_name        = "ecs-videochat"
  container_image = "latest"

  # ECS Configuration
  ecs_cluster_name = "VideoChat-ECS-Cluster"

  # Fargate Configuration
  fargate_cpu    = 1024  # 1 vCPU
  fargate_memory = 2048  # 2 GB
  desired_count  = 2
  max_count      = 10
  min_count      = 1

  # Application Configuration
  app_name       = "videochat-ecs"
  container_port = 3000
  port          = 80

  # Health check
  healthcheck_path = "/"

  # ECS-specific tags
  additional_tags = {
    InfrastructureType = "ECS"
    Orchestration      = "Fargate"
  }
}
