# Terragrunt Makefile for VideoAndChatApp Infrastructure
# This is example.

.PHONY: help plan apply destroy validate fmt init

# Default environment
ENV ?= production

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

init: ## Initialize Terragrunt for specified environment
	@echo "Initializing Terragrunt for $(ENV) environment..."
	cd terragrunt/environments/$(ENV) && terragrunt init

plan: ## Plan Terraform changes for specified environment
	@echo "Planning changes for $(ENV) environment..."
	cd terragrunt/environments/$(ENV) && terragrunt plan

apply: ## Apply Terraform changes for specified environment
	@echo "Applying changes for $(ENV) environment..."
	cd terragrunt/environments/$(ENV) && terragrunt apply

destroy: ## Destroy infrastructure for specified environment
	@echo "Destroying $(ENV) environment..."
	cd terragrunt/environments/$(ENV) && terragrunt destroy

validate: ## Validate Terraform configuration
	@echo "Validating Terraform configuration for $(ENV) environment..."
	cd terragrunt/environments/$(ENV) && terragrunt validate

fmt: ## Format Terraform and Terragrunt files
	@echo "Formatting Terraform files..."
	terraform fmt -recursive terragrunt/modules/
	@echo "Terragrunt HCL files formatting requires manual review"

run-checks: ## Run all validation checks
	@echo "Running format check..."
	terraform fmt -check -recursive terragrunt/modules/
	@echo "Running validation for all environments..."
	@for env in development staging production; do \
		echo "Validating $$env environment..."; \
		cd terragrunt/environments/$$env && terragrunt validate; \
		cd ../../..; \
	done

plan-all: ## Plan all environments
	@for env in development staging production; do \
		echo "Planning $$env environment..."; \
		cd terragrunt/environments/$$env && terragrunt plan; \
		cd ../../..; \
	done

# Include Docker commands
include docker.mk

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Examples:
# make plan ENV=development
# make apply ENV=staging
# make destroy ENV=production
