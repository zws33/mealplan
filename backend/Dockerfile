# Stage 1: Set up the TypeScript app with tsx
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Install tsx globally
RUN npm install -g tsx

# Expose the application's port
EXPOSE 3000

# Set the environment variable file
ENV NODE_ENV=development

# Run the app with tsx in watch mode
CMD ["tsx", "watch", "src/index.ts"]