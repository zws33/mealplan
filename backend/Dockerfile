# backend/Dockerfile

# Stage 1: Build the TypeScript code
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Install nodemon globally
RUN npm install -g nodemon

# Expose the application's port
EXPOSE 3000

# Set the environment variable file
ENV NODE_ENV=development

# Copy nodemon configuration
COPY nodemon.json .

# Run the app with Nodemon
CMD ["nodemon", "-L", "--config", "nodemon.json"]