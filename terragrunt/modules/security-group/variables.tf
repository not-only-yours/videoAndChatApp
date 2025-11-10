variable "name" {
  description = "Name for the security group."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the security group will be created."
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)."
  type        = string
}

variable "allow_all_connection" {
  description = "Whether to allow all inbound connections (use with caution)."
  type        = bool
  default     = false
}

variable "ingress_cidr_blocks" {
  description = "List of CIDR-based ingress rules."
  type = list(object({
    description = string
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = []
}

variable "ingress_security_group_rules" {
  description = "List of security group-based ingress rules."
  type = list(object({
    description              = string
    from_port               = number
    to_port                 = number
    protocol                = string
    source_security_group_id = string
  }))
  default = []
}

variable "egress_cidr_blocks" {
  description = "List of CIDR-based egress rules."
  type = list(object({
    description = string
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = []
}
