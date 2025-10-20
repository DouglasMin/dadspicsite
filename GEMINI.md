# Gemini Code Assistant Context: Dad's Art Portfolio Website

This document provides context for the Gemini code assistant to understand the project structure, technologies, and conventions.

## Project Overview

This project is a full-stack web application for an artist's portfolio website. It allows the artist to showcase their work, manage exhibitions, and provide a contact method for inquiries. The primary use case is for museum visitors to scan a QR code on a physical artwork and be taken to a web page with details about that specific piece.

### Key Features

*   **Artwork Gallery:** Displays artworks with details like title, description, size, and story.
*   **Exhibition Announcements:** Lists upcoming and past exhibitions.
*   **Contact Form:** Allows visitors to send inquiries to the artist.
*   **Admin Panel:** A password-protected section for the artist to manage artworks and exhibitions.

### Architecture

The project is a monorepo with three main components:

*   **`frontend`:** A React single-page application (SPA) built with Vite and styled with Tailwind CSS.
*   **`backend`:** A Node.js serverless application using Express, deployed as a Docker container to AWS Lambda.
*   **`terraform`:** Infrastructure as Code (IaC) to manage the AWS resources.

## Technologies Used

*   **Frontend:**
    *   React 19
    *   Vite
    *   TypeScript
    *   React Router
    *   Tailwind CSS
    *   Radix UI (for accessible components)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   AWS SDK for JavaScript (v3)
    *   Docker
*   **Infrastructure (AWS):**
    *   Terraform
    *   API Gateway (for routing requests to Lambda)
    *   Lambda (for running the backend code)
    *   DynamoDB (for storing artwork and exhibition data)
    *   S3 (for storing images and hosting the frontend)
    *   Cognito (for admin authentication)
    *   ECR (for storing the backend Docker image)
    *   SES (for the contact form email)

## Building and Running

### Frontend

To run the frontend development server:

```bash
cd frontend
npm install
npm run dev
```

To build the frontend for production:

```bash
cd frontend
npm run build
```

### Backend

The backend is deployed as a Docker container to AWS Lambda. The `deploy-lambda.sh` script automates this process.

To deploy the backend:

```bash
./deploy-lambda.sh
```

**Note:** This script requires AWS credentials to be configured in a profile named `dongik2`.

### Infrastructure

The AWS infrastructure is managed by Terraform. To apply changes to the infrastructure:

```bash
cd terraform
terraform init
terraform apply
```

**Note:** This also requires AWS credentials to be configured.

## Development Conventions

*   **Code Style:** The project uses ESLint for both the frontend and backend to enforce a consistent code style. Run `npm run lint` in the respective directories to check for issues.
*   **Commits:** (Inferring from typical practices) Commit messages should follow the Conventional Commits specification.
*   **Branching:** (Inferring from typical practices) Feature development should be done on separate branches and merged into `main` via pull requests.
*   **Frontend Path Aliases:** The frontend code uses the `@` alias for the `src` directory (e.g., `import MyComponent from '@/components/MyComponent'`).
