variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "image_uri" {
  description = "ECR image URI for the Lambda function"
  type        = string
}

variable "timeout" {
  description = "Timeout for the Lambda function"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Memory size for the Lambda function"
  type        = number
  default     = 512
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "dynamodb_table_arns" {
  description = "List of DynamoDB table ARNs"
  type        = list(string)
}

variable "s3_images_bucket_arn" {
  description = "ARN of the S3 images bucket"
  type        = string
}

variable "artworks_table_name" {
  description = "Name of the artworks DynamoDB table"
  type        = string
}

variable "exhibitions_table_name" {
  description = "Name of the exhibitions DynamoDB table"
  type        = string
}

variable "images_bucket_name" {
  description = "Name of the S3 images bucket"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}