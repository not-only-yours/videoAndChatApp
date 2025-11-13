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

# Kubernetes provider configuration for EKS
generate "provider_kubernetes" {
  path      = "provider_kubernetes.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "kubernetes" {
  host                   = dependency.cluster.outputs.cluster_endpoint
  cluster_ca_certificate = base64decode(dependency.cluster.outputs.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = [
      "eks",
      "get-token",
      "--role", dependency.data.outputs.iam_assumed_role_arn,
      "--cluster-name", dependency.cluster.outputs.cluster_name
    ]
  }
}

provider "kubectl" {
  host                   = dependency.cluster.outputs.cluster_endpoint
  cluster_ca_certificate = base64decode(dependency.cluster.outputs.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = [
      "eks",
      "get-token",
      "--role", dependency.data.outputs.iam_assumed_role_arn,
      "--cluster-name", dependency.cluster.outputs.cluster_name
    ]
  }
}
EOF
}
