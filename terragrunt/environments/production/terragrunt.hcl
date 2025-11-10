include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/environment"
}

inputs = {
  # Environment specific variables
  environment = "production"

  # Production environment for video and chat application
  description = "Production environment for video and chat application with high availability and scalability configuration."

  # AWS region
  aws_region = "eu-west-1"

  # VPC Configuration
  vpc_CIDR           = "10.0.0.0/16"
  public_subnets     = ["10.0.0.0/24", "10.0.2.0/24"]
  private_subnets    = ["10.0.1.0/24", "10.0.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  # Load Balancer
  arn_certificate_for_HTTPS_connection_to_frontend_ALB = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  DNS = "monitoring-ops.pp.ua"

  # ECR
  ecr_name        = "not-only-yoursvideochat"
  container_image = "b25e236b"

  # ECS
  ecs_cluster_name = "MyCluster"
  port             = 80
  container_port   = 3000

  # Secrets
  dns_secret_name = "REACT_APP_VideoChat"

  # Health check
  healthcheck_path = "/"

  # AWS credentials (these should be set via environment variables or AWS profiles)
  # ACCESS_KEY and SECRET_KEY should be provided via environment variables or AWS CLI profiles
}
