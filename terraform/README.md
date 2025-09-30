# Terraform Infrastructure

This directory contains Terraform configurations for Dad's Art Portfolio infrastructure on AWS.

## Architecture

- **ECR**: Container registry for Lambda Docker images
- **Lambda**: Node.js 22 functions running in Docker containers
- **API Gateway**: REST API with Cognito authorization
- **DynamoDB**: Tables for artworks and exhibitions
- **S3**: Buckets for images and frontend static website
- **Cognito**: User pool for admin authentication

## Prerequisites

- Terraform >= 1.5
- AWS CLI configured with profile `dongik2`
- Docker (for building Lambda images)

## Initial Setup

### 1. Create tfvars file

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Create ECR repository first (for Docker images)

```bash
terraform apply -target=module.ecr
```

### 4. Build and push Docker image

```bash
# Get ECR repository URL
ECR_URL=$(terraform output -raw ecr_repository_url)

# Login to ECR
aws ecr get-login-password --region ap-northeast-2 --profile dongik2 | docker login --username AWS --password-stdin $ECR_URL

# Build and push Docker image
cd ../backend
docker build --platform linux/amd64 -t dadspicsite-lambda:latest .
docker tag dadspicsite-lambda:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

### 5. Deploy remaining infrastructure

```bash
cd ../terraform
terraform apply
```

## Deployment

### Plan changes

```bash
terraform plan
```

### Apply changes

```bash
terraform apply
```

### Destroy infrastructure

```bash
terraform destroy
```

## Outputs

After deployment, important URLs and IDs are output:

- `ecr_repository_url`: ECR repository URL
- `api_endpoint`: API Gateway endpoint
- `frontend_website_endpoint`: S3 static website URL
- `cognito_user_pool_id`: Cognito User Pool ID
- `cognito_client_id`: Cognito Client ID

## Creating Admin User

After Cognito User Pool is created:

```bash
# Get User Pool ID
USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)

# Create admin user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --profile dongik2

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id $USER_POOL_ID \
  --username admin@example.com \
  --password YourSecurePassword123! \
  --permanent \
  --profile dongik2
```

## Module Structure

```
modules/
├── api_gateway/  # API Gateway REST API with Cognito authorizer
├── cognito/      # Cognito User Pool for admin
├── dynamodb/     # DynamoDB tables for artworks and exhibitions
├── ecr/          # ECR repository for Lambda images
├── lambda/       # Lambda function with IAM roles and policies
└── s3/           # S3 buckets for images and frontend
```