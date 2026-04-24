# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the host to the container
# This allows Docker to cache the dependency installation layer if only source code changes
COPY server/package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the rest of the application source code from the host to the container
# We copy everything from the 'server' directory into '/app'
COPY server/ .

# Expose the port the app runs on (assuming Express default or common practice)
EXPOSE 3000

# Define the command to run the application when the container starts
CMD ["node", "server.js"]