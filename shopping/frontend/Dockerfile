# Use the official Node.js 20 image as the base
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

ARG API_URL
ENV API_URL=${API_URL}

# Build the application
RUN yarn build

# Start the application
CMD ["yarn", "start"]