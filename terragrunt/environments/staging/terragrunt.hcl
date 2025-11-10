include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/environment"
}

inputs = {
  # Environment specific variables
  environment = "staging"

  # Staging environment for video and chat application
  description = "Staging environment for video and chat application that mirrors production for pre-deployment testing."

  # AWS region
  aws_region = "eu-west-1"

  # VPC Configuration
  vpc_CIDR           = "10.1.0.0/16"
  public_subnets     = ["10.1.0.0/24", "10.1.2.0/24"]
  private_subnets    = ["10.1.1.0/24", "10.1.3.0/24"]
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  # Load Balancer (using same certificate for staging)
  arn_certificate_for_HTTPS_connection_to_frontend_ALB = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
  DNS = "staging-monitoring-ops.pp.ua"

  # ECR
  ecr_name        = "staging-not-only-yoursvideochat"
  container_image = "latest"

  # ECS
  ecs_cluster_name = "StagingCluster"
  port             = 80
  container_port   = 3000

  # Secrets
  dns_secret_name = "REACT_APP_VideoChat_Staging"

  # Health check
  healthcheck_path = "/"
}
