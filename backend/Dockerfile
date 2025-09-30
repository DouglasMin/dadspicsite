# Use AWS Lambda Node.js 22 base image
FROM public.ecr.aws/lambda/nodejs:22

# Copy package files
COPY package*.json ${LAMBDA_TASK_ROOT}/

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src/ ${LAMBDA_TASK_ROOT}/src/

# Set the handler to main router
CMD [ "src/index.handler" ]