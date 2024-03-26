# Use the official Node.js image as a base
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the remaining application files to the working directory
COPY . .

EXPOSE 3000

CMD ["npm run", "start"]

# Build the React app
# RUN npm build

# Use Nginx as the web server to serve the React app
# FROM nginx:alpine

# # Copy the built React app from the previous stage to the Nginx server's web root directory
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80
# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
