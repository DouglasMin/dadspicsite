resource "aws_cognito_user_pool" "admin" {
  name = var.user_pool_name

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # Admin account verification
  auto_verified_attributes = ["email"]

  # Username configuration
  username_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Schema attributes
  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  tags = var.tags
}

# User Pool Client for admin
resource "aws_cognito_user_pool_client" "admin" {
  name         = "${var.user_pool_name}-client"
  user_pool_id = aws_cognito_user_pool.admin.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  # Token validity
  access_token_validity  = 60  # minutes
  id_token_validity      = 60  # minutes
  refresh_token_validity = 30  # days

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  prevent_user_existence_errors = "ENABLED"
}

# User Pool Domain
resource "aws_cognito_user_pool_domain" "admin" {
  domain       = var.cognito_domain
  user_pool_id = aws_cognito_user_pool.admin.id
}