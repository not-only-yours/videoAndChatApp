variable "aws-region" {
  description = "Amazon region"
  type        = string
  default     = "eu-west-1"
}

variable "apiKey" {
  description = "Firebase API key"
  type        = string
  sensitive   = true
}

variable "authDomain" {
  description = "Firebase authentication domain"
  type        = string
}

variable "projectId" {
  description = "Firebase project ID"
  type        = string
}

variable "storageBucket" {
  description = "Firebase storage bucket"
  type        = string
}

variable "messagingSenderId" {
  description = "Firebase messaging sender ID"
  type        = string
  sensitive   = true
}

variable "appId" {
  description = "Firebase app ID"
  type        = string
  sensitive   = true
}

variable "measurementId" {
  description = "Google Analytics measurement ID"
  type        = string
}

variable "databaseURL" {
  description = "Firebase database URL"
  type        = string
}