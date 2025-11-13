data "kubectl_path_documents" "manifests" {
  pattern = "./files/manifests.yaml"

  vars = {
    # Application configuration
    name                = var.name
    namespace           = var.namespace
    image               = var.image
    image_version       = var.image_version
    port                = var.port
    replicas            = var.replicas
    environment         = var.environment

    # Image configuration
    ecr_repository_url  = var.ecr_repository_url

    # DNS and SSL
    dns_domain          = var.dns_domain
    certificate_arn     = var.certificate_arn
    health_check_path   = var.health_check_path

    # Resource configuration
    cpu_limit           = var.resource_limits.cpu
    memory_limit        = var.resource_limits.memory
    cpu_request         = var.resource_requests.cpu
    memory_request      = var.resource_requests.memory

    # Environment variables (convert map to JSON for template)
    environment_variables = jsonencode(var.environment_variables)
    secrets              = jsonencode(var.secrets)
  }
}

resource "kubectl_manifest" "this" {
  for_each  = var.enabled ? { for idx, doc in data.kubectl_path_documents.manifests.documents : idx => doc } : {}
  yaml_body = each.value
}

# Outputs
output "namespace" {
  description = "The namespace where the application is deployed"
  value       = var.namespace
}

output "service_name" {
  description = "The name of the Kubernetes service"
  value       = "${var.name}-service"
}

output "deployment_name" {
  description = "The name of the Kubernetes deployment"
  value       = var.name
}

output "ingress_name" {
  description = "The name of the Kubernetes ingress"
  value       = "${var.name}-ingress"
}
