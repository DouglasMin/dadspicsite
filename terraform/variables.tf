variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["*"]
}

variable "lambda_image_uri" {
  description = "Lambda container image URI (leave empty for initial setup)"
  type        = string
  default     = ""
}

variable "naver_client_id" {
  description = "Naver Maps API Client ID"
  type        = string
  sensitive   = true
}

variable "naver_client_secret" {
  description = "Naver Maps API Client Secret"
  type        = string
  sensitive   = true
}