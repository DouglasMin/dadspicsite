#!/bin/bash

# Automated Lambda Deployment Script
# This script builds, pushes, and deploys Lambda code changes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_PROFILE="dongik2"
AWS_REGION="ap-northeast-2"
ECR_REPO="863518440691.dkr.ecr.ap-northeast-2.amazonaws.com/dadspicsite-lambda"
BACKEND_DIR="backend"
TERRAFORM_DIR="terraform"

echo -e "${YELLOW}🚀 Starting Lambda deployment...${NC}\n"

# Step 1: Build Docker image
echo -e "${YELLOW}📦 Building Docker image for linux/amd64...${NC}"
cd "$BACKEND_DIR"
docker buildx build --platform linux/amd64 -t dadspicsite-lambda:latest --load .
echo -e "${GREEN}✓ Docker image built${NC}\n"

# Step 2: Login to ECR
echo -e "${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region "$AWS_REGION" --profile "$AWS_PROFILE" | \
  docker login --username AWS --password-stdin "$ECR_REPO"
echo -e "${GREEN}✓ ECR login successful${NC}\n"

# Step 3: Tag and push image with timestamp to force update
TIMESTAMP=$(date +%s)
echo -e "${YELLOW}🏷️  Tagging image with timestamp: $TIMESTAMP${NC}"
docker tag dadspicsite-lambda:latest "$ECR_REPO:$TIMESTAMP"
docker tag dadspicsite-lambda:latest "$ECR_REPO:latest"

echo -e "${YELLOW}📤 Pushing image to ECR...${NC}"
docker push "$ECR_REPO:$TIMESTAMP"
docker push "$ECR_REPO:latest"
echo -e "${GREEN}✓ Image pushed to ECR${NC}\n"

# Step 4: Update Terraform with new image URI
cd "../$TERRAFORM_DIR"
echo -e "${YELLOW}🔧 Updating Lambda with new image...${NC}"
AWS_PROFILE="$AWS_PROFILE" terraform apply \
  -var="lambda_image_uri=$ECR_REPO:$TIMESTAMP" \
  -auto-approve
echo -e "${GREEN}✓ Lambda function updated${NC}\n"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "Image URI: ${YELLOW}$ECR_REPO:$TIMESTAMP${NC}\n"
