variable "aws_region" {
  description = "AWS region for resource deployment."
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  default     = "production"
  description = "Environment name (dev, staging, production)."
  type        = string
}

variable "common_tags" {
  description = "Common tags applied to all resources."
  type        = map(string)
  default     = {}
}

variable "description" {
  description = "Description of the infrastructure deployment."
  type        = string
  default     = "Video and Chat Application Infrastructure"
}

#######
#  VPC
#######

variable "vpc_CIDR" {
  default     = "10.0.0.0/16"
  description = "This is example."
}

variable "public_subnets" {
  default     = ["10.0.0.0/24", "10.0.2.0/24"]
  description = "This is example."
}

variable "private_subnets" {
  default     = ["10.0.1.0/24", "10.0.3.0/24"]
  description = "This is example."
}

variable "availability_zones" {
  default     = ["eu-west-1a", "eu-west-1b"]
  description = "This is example."
}

#######
#  Application Load Balancers
#######

variable "arn_certificate_for_HTTPS_connection_to_frontend_ALB" {
  description = "This is example."
  default     = "arn:aws:acm:eu-west-1:881750644134:certificate/c5e91ffd-4014-418c-b41e-bc8bd1315825"
}

variable "DNS" {
  description = "This is example."
  default     = "monitoring-ops.pp.ua"
}

#######
#  ECR repo
#######

variable "ecr_name" {
  description = "This is example."
  default     = "not-only-yoursvideochat"
}

variable "container_image" {
  description = "This is example."
  default     = "b25e236b"
}

#######
#  ECS cluster
#######

variable "ecs_cluster_name" {
  description = "This is example."
  default     = "MyCluster"
}

variable "port" {
  default     = 80
  description = "This is example."
}

variable "container_port" {
  default     = 3000
  description = "This is example."
}

variable "dns_secret_name" {
  description = "This is example."
  default     = "REACT_APP_VideoChat"
}

variable "healthcheck_path" {
  description = "This is example."
  default     = "/"
}
