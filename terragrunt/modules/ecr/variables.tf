variable "environment" {
  type        = string
  description = "The environment name (e.g., dev, staging, production)."
}

variable "name" {
  type        = string
  description = "The name of the ECR repository."
}

variable "max_images_in_repo" {
  type        = number
  description = "Maximum number of images to retain in the repository."
  default     = 5
}
