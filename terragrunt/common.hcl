# Common variables used across all environments
# Shared configuration for video and chat application infrastructure

locals {
  # Common tags applied to all resources
  common_tags = {
    Project     = "VideoAndChatApp"
    ManagedBy   = "Terragrunt"
    Owner       = "DevOps Team"
    Repository  = "videoAndChatApp"
  }

  # Common AWS configuration
  aws_region = "eu-west-1"

  # Common container configuration
  container_port = 3000
  port          = 80
  healthcheck_path = "/"

  # Common certificate ARN (you should update this with your actual certificate)
  certificate_arn = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
}
