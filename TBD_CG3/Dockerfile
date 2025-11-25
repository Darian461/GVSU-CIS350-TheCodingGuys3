# Frontend/Dockerfile
FROM node:18

WORKDIR /app

# Copy only package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose Expo's web port
EXPOSE 8081

# Start Expo in web mode
CMD ["npx", "expo", "start", "--web"]
