variable "enabled" {
  description = "Enable or disable the video chat application deployment."
  type        = bool
  default     = true
}

variable "name" {
  description = "The name of the video chat application deployment."
  type        = string
  default     = "videochat-app"
}

variable "namespace" {
  description = "The Kubernetes namespace where the video chat application will be deployed."
  type        = string
  default     = "videochat"
}

variable "image" {
  description = "The Docker image for the video chat application."
  type        = string
  default     = "not-only-yoursvideochat"
}

variable "image_version" {
  description = "The version tag of the video chat application Docker image."
  type        = string
  default     = "latest"
}

variable "port" {
  description = "The port on which the video chat application will listen."
  type        = number
  default     = 3000
}

variable "replicas" {
  description = "Number of replicas for the video chat application."
  type        = number
  default     = 2
}

variable "environment" {
  description = "Environment name (development, staging, production)."
  type        = string
  default     = "development"
}

variable "ecr_repository_url" {
  description = "ECR repository URL for the Docker image."
  type        = string
  default     = ""
}

variable "dns_domain" {
  description = "DNS domain for the application."
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate for HTTPS."
  type        = string
  default     = ""
}

variable "health_check_path" {
  description = "Health check path for the application."
  type        = string
  default     = "/"
}

variable "resource_limits" {
  description = "Resource limits for the containers."
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "500m"
    memory = "512Mi"
  }
}

variable "resource_requests" {
  description = "Resource requests for the containers."
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "250m"
    memory = "256Mi"
  }
}

variable "environment_variables" {
  description = "Environment variables for the application."
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Secret environment variables for the application."
  type        = map(string)
  default     = {}
  sensitive   = true
}
