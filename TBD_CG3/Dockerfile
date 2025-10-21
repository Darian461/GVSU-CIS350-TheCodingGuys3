# Frontend/Dockerfile
FROM node:lts

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of frontend files
COPY . .

# Expose Expo's web port
EXPOSE 8081

# Start Expo in web mode
CMD ["npx", "expo", "start", "--web"]

