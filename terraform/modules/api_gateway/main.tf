resource "aws_api_gateway_rest_api" "this" {
  name        = var.api_name
  description = "API for Dad's Art Portfolio"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.tags
}

# Cognito Authorizer
resource "aws_api_gateway_authorizer" "cognito" {
  name          = "cognito-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [var.cognito_user_pool_arn]
}

# /artworks resource
resource "aws_api_gateway_resource" "artworks" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "artworks"
}

# /artworks/{id} resource
resource "aws_api_gateway_resource" "artwork_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.artworks.id
  path_part   = "{id}"
}

# /exhibitions resource
resource "aws_api_gateway_resource" "exhibitions" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "exhibitions"
}

# /exhibitions/{id} resource
resource "aws_api_gateway_resource" "exhibition_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.exhibitions.id
  path_part   = "{id}"
}

# /contact resource
resource "aws_api_gateway_resource" "contact" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "contact"
}

# /health resource
resource "aws_api_gateway_resource" "health" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "health"
}

# /upload resource
resource "aws_api_gateway_resource" "upload" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "upload"
}

# GET /health (no auth)
resource "aws_api_gateway_method" "health_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.health.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "health_get" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.health.id
  http_method             = aws_api_gateway_method.health_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# CORS for all resources
resource "aws_api_gateway_method" "options" {
  for_each = toset([
    aws_api_gateway_resource.artworks.id,
    aws_api_gateway_resource.artwork_id.id,
    aws_api_gateway_resource.exhibitions.id,
    aws_api_gateway_resource.exhibition_id.id,
    aws_api_gateway_resource.contact.id,
    aws_api_gateway_resource.health.id,
    aws_api_gateway_resource.upload.id,
  ])

  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = each.value
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options" {
  for_each = aws_api_gateway_method.options

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value.resource_id
  http_method = each.value.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options" {
  for_each = aws_api_gateway_method.options

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value.resource_id
  http_method = each.value.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "options" {
  for_each = aws_api_gateway_integration.options

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value.resource_id
  http_method = each.value.http_method
  status_code = aws_api_gateway_method_response.options[each.key].status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}

# Deployment
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.artworks.id,
      aws_api_gateway_resource.artwork_id.id,
      aws_api_gateway_resource.exhibitions.id,
      aws_api_gateway_resource.exhibition_id.id,
      aws_api_gateway_resource.contact.id,
      aws_api_gateway_resource.health.id,
      aws_api_gateway_resource.upload.id,
      aws_api_gateway_method.health_get.id,
      aws_api_gateway_integration.health_get.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.health_get,
    aws_api_gateway_integration.health_get,
    aws_api_gateway_method.artworks_get,
    aws_api_gateway_method.artworks_post,
    aws_api_gateway_method.artwork_id_get,
    aws_api_gateway_method.artwork_id_put,
    aws_api_gateway_method.artwork_id_delete,
    aws_api_gateway_method.exhibitions_get,
    aws_api_gateway_method.exhibitions_post,
    aws_api_gateway_method.exhibition_id_get,
    aws_api_gateway_method.exhibition_id_put,
    aws_api_gateway_method.exhibition_id_delete,
    aws_api_gateway_method.contact_post,
    aws_api_gateway_method.upload_post,
  ]
}

# Stage
resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = var.stage_name

  tags = var.tags
}