output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = module.api_gateway.api_endpoint
}

output "frontend_website_endpoint" {
  description = "Frontend S3 website endpoint"
  value       = module.s3.frontend_website_endpoint
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.cognito.user_pool_client_id
}

output "images_bucket_name" {
  description = "S3 images bucket name"
  value       = module.s3.images_bucket_name
}

output "artworks_table_name" {
  description = "DynamoDB artworks table name"
  value       = module.dynamodb.artworks_table_name
}

output "exhibitions_table_name" {
  description = "DynamoDB exhibitions table name"
  value       = module.dynamodb.exhibitions_table_name
}