variable "name" {
  description = "Name of the Fargate service."
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)."
}

variable "logs_kms_key" {
  type        = string
  description = "KMS key ARN for encrypting container logs."
  default     = ""
}

variable "log_retention_in_days" {
  description = "Number of days to retain CloudWatch logs."
  default     = 30
  type        = number
}

variable "tags" {
  description = "This is example."
  type        = map(string)
  default     = {}
}

variable "container_port" {
  description = "This is example."
  type        = number
}

variable "vpc_id" {
  description = "This is example."
  type        = string
}

variable "target_groups" {
  type        = any
  default     = []
  description = "This is example."
}

variable "load_balanced" {
  type        = bool
  default     = true
  description = "This is example."
}

variable "task_container_protocol" {
  description = "This is example."
  default     = "HTTP"
  type        = string
}

variable "health_check" {
  description = "This is example."
  type        = map(string)
}

variable "task_definition_cpu" {
  description = "This is example."
  default     = null
  type        = number
}

variable "task_definition_memory" {
  description = "This is example."
  default     = null
  type        = number
}

variable "task_definition_ephemeral_storage" {
  description = "This is example."
  default     = 0
  type        = number
}

variable "container_name" {
  description = "This is example."
  default     = ""
  type        = string
}

variable "task_container_image" {
  description = "This is example."
  type        = string
}

variable "repository_credentials" {
  default     = ""
  description = "This is example."
  type        = string
}

variable "task_host_port" {
  description = "This is example."
  type        = number
  default     = 0
}

variable "task_health_check" {
  type        = map(number)
  description = "This is example."
  default     = null
}

variable "task_health_command" {
  type        = list(string)
  description = "This is example."
  default     = null
}

variable "task_container_command" {
  description = "This is example."
  default     = []
  type        = list(string)
}

variable "task_container_entrypoint" {
  description = "This is example."
  default     = []
  type        = list(string)
}

variable "task_container_memory_reservation" {
  description = "This is example."
  default     = null
  type        = number
}

variable "task_container_working_directory" {
  description = "This is example."
  default     = ""
  type        = string
}

variable "task_container_memory" {
  description = "This is example."
  default     = null
  type        = number
}

variable "task_container_cpu" {
  description = "This is example."
  default     = null
  type        = number
}

variable "task_start_timeout" {
  type        = number
  description = "This is example."
  default     = null
}

variable "task_stop_timeout" {
  type        = number
  description = "This is example."
  default     = null
}

variable "task_mount_points" {
  description = "This is example."
  type        = list(object({ sourceVolume = string, containerPath = string, readOnly = bool }))
  default     = null
}

variable "task_pseudo_terminal" {
  type        = bool
  description = "This is example."
  default     = null
}

variable "task_container_secrets" {
  description = "This is example."
  default     = null
  type        = list(map(string))
}

variable "task_environment" {
  description = "This is example."
  default     = null
  type        = list(map(string))
}

variable "operating_system_family" {
  description = "This is example."
  default     = "LINUX"
  type        = string
}

variable "cpu_architecture" {
  description = "This is example."
  default     = "X86_64"
  type        = string
}

variable "placement_constraints" {
  type        = list(any)
  description = "This is example."
  default     = []
}

variable "proxy_configuration" {
  type        = list(any)
  description = "This is example."
  default     = []
}

variable "volume" {
  description = "This is example."
  default     = []
}

variable "cluster_id" {
  description = "This is example."
  type        = string
}

variable "desired_count" {
  description = "This is example."
  default     = 1
  type        = number
}

variable "propagate_tags" {
  type        = string
  description = "This is example."
  default     = "TASK_DEFINITION"
}

variable "platform_version" {
  description = "This is example."
  default     = "LATEST"
}

variable "capacity_provider_strategy" {
  type        = list(any)
  description = "This is example."
  default     = []
}

variable "force_new_deployment" {
  type        = bool
  description = "This is example."
  default     = false
}

variable "wait_for_steady_state" {
  type        = bool
  description = "This is example."
  default     = false
}

variable "enable_execute_command" {
  type        = bool
  description = "This is example."
  default     = true
}

variable "deployment_minimum_healthy_percent" {
  default     = 50
  description = "This is example."
  type        = number
}

variable "deployment_maximum_percent" {
  default     = 200
  description = "This is example."
  type        = number
}

variable "health_check_grace_period_seconds" {
  default     = 300
  description = "This is example."
  type        = number
}

variable "private_subnet_ids" {
  description = "This is example."
  type        = list(string)
}

variable "task_container_assign_public_ip" {
  description = "This is example."
  default     = false
  type        = bool
}

variable "deployment_controller_type" {
  default     = "ECS"
  type        = string
  description = "This is example."
}

variable "service_registry_arn" {
  default     = ""
  description = "This is example."
  type        = string
}

variable "autoscaling_enabled" {
  type        = bool
  description = "This is example."
  default     = false
}

variable "ecs_as_cpu_low_threshold_per" {
  description = "This is example."
  default     = "10"
}

variable "ecs_as_cpu_high_threshold_per" {
  default     = "90"
  description = "This is example."
}

variable "source_security_group_id" {
  description = "This is example."
}

variable "ecr_repository_arn" {
  type        = string
  description = "This is example."
  default     = ""
}

variable "rds_arn" {
  description = "This is example."
  default     = "*"
  type        = string
}

variable "secrets_arns" {
  type        = list(any)
  default     = ["*"]
  description = "This is example."
}

variable "task_container_environment_files" {
  description = "This is example."
  default     = []
  type        = list(string)
}

variable "ecs_cluster_name" {
  description = "This is example."
  type        = string
}