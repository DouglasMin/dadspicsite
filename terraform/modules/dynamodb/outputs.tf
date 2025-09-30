output "artworks_table_name" {
  description = "Name of the artworks DynamoDB table"
  value       = aws_dynamodb_table.artworks.name
}

output "artworks_table_arn" {
  description = "ARN of the artworks DynamoDB table"
  value       = aws_dynamodb_table.artworks.arn
}

output "exhibitions_table_name" {
  description = "Name of the exhibitions DynamoDB table"
  value       = aws_dynamodb_table.exhibitions.name
}

output "exhibitions_table_arn" {
  description = "ARN of the exhibitions DynamoDB table"
  value       = aws_dynamodb_table.exhibitions.arn
}