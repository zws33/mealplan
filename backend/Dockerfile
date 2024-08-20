# backend/Dockerfile

# Stage 1: Build the TypeScript code
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run the app with Nodemon
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app /app
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Expose the application's port
EXPOSE 3000

# Set the environment variable file
ENV NODE_ENV=development

# Run the app with Nodemon
CMD ["nodemon", "--watch", "src", "--exec", "npm run dev"]