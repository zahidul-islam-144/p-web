# Use an official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Install dotenv to load environment variables from .env file
RUN npm install dotenv --save

# Copy the TypeScript source code and .env file to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Command to run your application
CMD ["node", "dist/app.js", "start:dev"]
