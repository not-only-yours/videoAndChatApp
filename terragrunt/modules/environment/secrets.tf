variable "ACCESS_KEY" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "SECRET_KEY" {
  description = "AWS Secret Key"
  type        = string
  sensitive   = true
}

variable "aws-region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}
