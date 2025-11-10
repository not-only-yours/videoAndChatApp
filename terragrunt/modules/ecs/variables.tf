variable "environment" {
  description = "The environment name (e.g., dev, staging, production)."
  type        = string
}

variable "name" {
  description = "The name of the ECS cluster."
  type        = string
}
