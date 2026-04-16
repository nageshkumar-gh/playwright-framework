# Dockerfile for Playwright application
FROM node:20-bookworm

RUN npx -y playwright@1.59.1 install --with-deps

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variable for CI mode - this is a CI/non-interactive environment
ENV CI=true

ENTRYPOINT [ "npx", "playwright", "test" ]






