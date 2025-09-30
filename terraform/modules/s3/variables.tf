variable "images_bucket_name" {
  description = "Name of the S3 bucket for artwork images"
  type        = string
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend static website"
  type        = string
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins for images bucket"
  type        = list(string)
  default     = ["*"]
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}