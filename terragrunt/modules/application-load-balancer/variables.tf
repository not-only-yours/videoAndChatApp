variable "vpc_id" {
  description = "The ID of the VPC where the load balancer will be created."
  type        = string
}

variable "name" {
  description = "The name of the Application Load Balancer."
  type        = string
}

variable "is_internal" {
  description = "Whether the load balancer is internal or internet-facing."
  type        = bool
}

variable "subnets" {
  description = "A list of subnet IDs to attach to the load balancer."
  type        = list(string)
}

variable "certificate_arn" {
  description = "The ARN of the SSL certificate for HTTPS listeners."
  type        = string
  default     = ""
}

variable "target_group_arn" {
  description = "The ARN of the target group to route traffic to."
  type        = string
}

variable "internal_port" {
  description = "The port number for internal load balancer traffic."
  type        = number
  default     = null
}

variable "security_groups_ingress_traffic" {
  description = "Security group IDs that are allowed to send traffic to the load balancer."
  type        = string
  default     = ""
}

variable "environment" {
  description = "The environment name (e.g., dev, staging, production)."
  type        = string
}

variable "ingress_cidr" {
  description = "CIDR blocks allowed to access the load balancer."
  type        = list(string)
  default     = []
}