# Use the official Node.js image as the base image
FROM --platform=linux/amd64 node:16.20.2 AS builder

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Use a smaller Node.js image for the final stage
FROM --platform=linux/amd64 node:16.20.2-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install dependencies only for production
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 8574

# Define the command to run the application
CMD ["npm", "run", "start:prod"]
