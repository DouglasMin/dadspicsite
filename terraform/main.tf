terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "dongik2"

  default_tags {
    tags = {
      Project     = "DadsPicSite"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

locals {
  project_name = "dadspicsite"
  common_tags = {
    Project     = "DadsPicSite"
    Environment = var.environment
  }
}

# ECR Repository
module "ecr" {
  source = "./modules/ecr"

  repository_name = "${local.project_name}-lambda"
  tags            = local.common_tags
}

# DynamoDB Tables
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name = "${local.project_name}-${var.environment}"
  tags       = local.common_tags
}

# S3 Buckets
module "s3" {
  source = "./modules/s3"

  images_bucket_name   = "${local.project_name}-images-${var.environment}"
  frontend_bucket_name = "${local.project_name}-frontend-${var.environment}"
  cors_allowed_origins = var.cors_allowed_origins
  tags                 = local.common_tags
}

# Cognito User Pool
module "cognito" {
  source = "./modules/cognito"

  user_pool_name = "${local.project_name}-admin-${var.environment}"
  cognito_domain = "${local.project_name}-${var.environment}"
  tags           = local.common_tags
}

# Lambda Function
module "lambda" {
  source = "./modules/lambda"

  function_name       = "${local.project_name}-api-${var.environment}"
  image_uri           = var.lambda_image_uri != "" ? var.lambda_image_uri : "${module.ecr.repository_url}:latest"
  timeout             = 30
  memory_size         = 512
  dynamodb_table_arns = [
    module.dynamodb.artworks_table_arn,
    module.dynamodb.exhibitions_table_arn
  ]
  s3_images_bucket_arn   = module.s3.images_bucket_arn
  artworks_table_name    = module.dynamodb.artworks_table_name
  exhibitions_table_name = module.dynamodb.exhibitions_table_name
  images_bucket_name     = module.s3.images_bucket_name

  environment_variables = {
    NODE_ENV              = var.environment
    NAVER_CLIENT_ID       = var.naver_client_id
    NAVER_CLIENT_SECRET   = var.naver_client_secret
  }

  tags = local.common_tags
}

# API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"

  api_name               = "${local.project_name}-api-${var.environment}"
  stage_name             = var.environment
  cognito_user_pool_arn  = module.cognito.user_pool_arn
  lambda_invoke_arn      = module.lambda.invoke_arn
  lambda_function_name   = module.lambda.function_name
  tags                   = local.common_tags
}