# Dad's Art Portfolio Website - Codebase Overview

## Project Summary

A modern art gallery platform with QR code integration for museum visitors. Built with serverless architecture on AWS.

**Primary Use Case**: Museum visitors scan QR codes on physical artworks → redirected to website with specific artwork details.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Lambda        │
│   (React/Vite)  │───▶│   (REST API)     │───▶│   (Node.js)     │
│   S3 Static     │    │   + Cognito Auth │    │   Container     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                       ┌─────────────────┐              │
                       │   DynamoDB      │◀─────────────┘
                       │   (Artworks +   │
                       │   Exhibitions)  │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   S3 Images     │
                       │   + SES Email   │
                       └─────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Radix UI
- **Routing**: React Router DOM
- **Auth**: AWS Cognito (amazon-cognito-identity-js)
- **Deployment**: S3 Static Website

### Backend
- **Runtime**: Node.js 22 (AWS Lambda)
- **Architecture**: Serverless containerized Lambda
- **Database**: DynamoDB (2 tables)
- **Storage**: S3 for images
- **Email**: SES for contact forms
- **API**: REST via API Gateway

### Infrastructure
- **IaC**: Terraform
- **Cloud**: AWS (ap-northeast-2)
- **Container**: Docker + ECR
- **CI/CD**: GitHub Actions + Manual Scripts

## Directory Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities (auth, api, utils)
│   │   └── assets/         # Static assets
│   └── package.json        # Dependencies & scripts
├── backend/                 # Node.js Lambda backend
│   ├── src/
│   │   ├── handlers/       # Lambda route handlers
│   │   ├── utils/          # Database & response utilities
│   │   └── index.js        # Main router
│   └── Dockerfile          # Container definition
├── terraform/              # Infrastructure as Code
│   ├── modules/            # Reusable Terraform modules
│   │   ├── api_gateway/    # REST API setup
│   │   ├── cognito/        # User authentication
│   │   ├── dynamodb/       # Database tables
│   │   ├── ecr/            # Container registry
│   │   ├── lambda/         # Function configuration
│   │   └── s3/             # Storage buckets
│   └── main.tf             # Main infrastructure config
└── deploy-lambda.sh        # Automated deployment script
```

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | No | Health check |
| GET | `/artworks` | No | List all artworks |
| GET | `/artworks/{id}` | No | Get specific artwork (QR destination) |
| POST | `/artworks` | Yes | Create artwork (admin) |
| PUT | `/artworks/{id}` | Yes | Update artwork (admin) |
| DELETE | `/artworks/{id}` | Yes | Delete artwork (admin) |
| GET | `/exhibitions` | No | List exhibitions |
| GET | `/exhibitions/{id}` | No | Get specific exhibition |
| POST | `/exhibitions` | Yes | Create exhibition (admin) |
| PUT | `/exhibitions/{id}` | Yes | Update exhibition (admin) |
| DELETE | `/exhibitions/{id}` | Yes | Delete exhibition (admin) |
| POST | `/contact` | No | Submit contact form |
| POST | `/upload` | Yes | Upload images (admin) |

**Live API**: `https://fffw8q7fo1.execute-api.ap-northeast-2.amazonaws.com/dev`

## Database Schema

### Artworks Table (`dadspicsite-dev`)
```javascript
{
  id: string,           // Primary key (UUID)
  title: string,        // Artwork title
  description: string,  // Detailed description
  year: number,         // Creation year
  medium: string,       // Art medium (oil, acrylic, etc.)
  dimensions: string,   // Physical dimensions
  imageUrl: string,     // S3 image URL
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

### Exhibitions Table (`dadspicsite-dev-exhibitions`)
```javascript
{
  id: string,           // Primary key (UUID)
  title: string,        // Exhibition title
  description: string,  // Exhibition description
  startDate: string,    // ISO date
  endDate: string,      // ISO date
  location: string,     // Exhibition venue
  imageUrl?: string,    // Optional banner image
  artworkIds: string[], // Array of artwork IDs
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

## Authentication

- **Admin Access**: Single Cognito user pool
- **User Pool ID**: Available in Terraform outputs
- **Client ID**: Available in Terraform outputs
- **Flow**: Email/password → JWT tokens → API Gateway authorizer

## Deployment

### Lambda Function Deployment

**Option 1: Automated Script (Recommended)**
```bash
./deploy-lambda.sh
```

**Option 2: GitHub Actions**
- Triggers on push to `main` branch with `backend/` changes
- Or manual trigger via GitHub UI

**Option 3: Manual Steps**
```bash
# Build & push
cd backend
docker buildx build --platform linux/amd64 -t dadspicsite-lambda:latest --load .
aws ecr get-login-password --region ap-northeast-2 --profile dongik2 | \
  docker login --username AWS --password-stdin 863518440691.dkr.ecr.ap-northeast-2.amazonaws.com/dadspicsite-lambda

# Deploy
TIMESTAMP=$(date +%s)
docker tag dadspicsite-lambda:latest 863518440691.dkr.ecr.ap-northeast-2.amazonaws.com/dadspicsite-lambda:$TIMESTAMP
docker push 863518440691.dkr.ecr.ap-northeast-2.amazonaws.com/dadspicsite-lambda:$TIMESTAMP

# Update Lambda
aws lambda update-function-code \
  --function-name dadspicsite-api-dev \
  --image-uri 863518440691.dkr.ecr.ap-northeast-2.amazonaws.com/dadspicsite-lambda:$TIMESTAMP \
  --region ap-northeast-2 --profile dongik2
```

### Frontend Deployment
- **GitHub Actions**: Auto-deploys on `frontend/` changes
- **Manual**: `cd frontend && npm run build && aws s3 sync dist/ s3://dadspicsite-frontend-dev`

## Environment Configuration

### Frontend (.env)
```
VITE_API_URL=https://fffw8q7fo1.execute-api.ap-northeast-2.amazonaws.com/dev
VITE_COGNITO_USER_POOL_ID=<from_terraform_output>
VITE_COGNITO_CLIENT_ID=<from_terraform_output>
```

### Backend (Lambda Environment Variables)
```
NODE_ENV=dev
ARTWORKS_TABLE_NAME=dadspicsite-dev
EXHIBITIONS_TABLE_NAME=dadspicsite-dev-exhibitions
IMAGES_BUCKET_NAME=dadspicsite-images-dev
AWS_REGION=ap-northeast-2
```

## Key Features

### Public Features (No Auth Required)
- **Gallery**: Browse all artworks with responsive grid
- **Artwork Details**: Individual pages for QR code destinations
- **Exhibitions**: View upcoming/current exhibitions
- **Contact Form**: Business inquiries sent via SES

### Admin Features (Cognito Auth Required)
- **Dashboard**: Basic admin interface
- **CRUD Operations**: Full management of artworks and exhibitions
- **Image Upload**: S3 integration for artwork images
- **Authentication**: Secure login with JWT tokens

## Current Status

### ✅ Completed
- Complete serverless infrastructure
- Backend API with all CRUD operations
- Frontend gallery and public pages
- Authentication system
- Deployment automation
- QR code integration ready

### 🚧 In Progress
- Admin CRUD UI (marked as "준비 중" in frontend)
- Complete admin dashboard functionality

### 📋 Technical Debt
- Mobile responsive navigation menu
- Error handling improvements
- Image optimization
- SEO optimization

## AWS Resources

### Core Services
- **Lambda**: `dadspicsite-api-dev`
- **API Gateway**: `dadspicsite-api-dev`
- **DynamoDB**: `dadspicsite-dev`, `dadspicsite-dev-exhibitions`
- **S3**: `dadspicsite-images-dev`, `dadspicsite-frontend-dev`
- **ECR**: `dadspicsite-lambda`
- **Cognito**: `dadspicsite-admin-dev`

### Configuration
- **AWS Profile**: `dongik2`
- **Region**: `ap-northeast-2` (Seoul)
- **Environment**: `dev`

## Development Workflow

1. **Backend Changes**: Edit code → `./deploy-lambda.sh` → Test API
2. **Frontend Changes**: Edit code → `npm run dev` → Test locally
3. **Infrastructure Changes**: Edit Terraform → `terraform apply`
4. **Production Deploy**: Push to `main` → GitHub Actions handles deployment

## Monitoring & Logs

- **Lambda Logs**: CloudWatch `/aws/lambda/dadspicsite-api-dev`
- **API Gateway**: CloudWatch API Gateway logs
- **Frontend**: S3 access logs (if enabled)

## Security Notes

- **CORS**: Configured for all origins (`*`) - consider restricting in production
- **IAM**: Least privilege policies for Lambda execution
- **Cognito**: Secure admin authentication
- **HTTPS**: All API endpoints use HTTPS
- **Input Validation**: Basic validation in Lambda handlers

---

*Last Updated: $(date)*
*This document serves as a comprehensive reference for the Dad's Art Portfolio codebase.*