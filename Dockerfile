# Use a lightweight base image
FROM node:alpine AS build

# Install dependencies
RUN apk update && apk add --no-cache \
    curl \
    python3 \
    python3-dev \
    gcc \
    musl-dev \
    linux-headers \
    ffmpeg \
    libsm \
    libxext \
    npm

# Copy source code and install dependencies
WORKDIR /app
COPY ./webpage/package*.json ./webpage/
RUN npm install
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Build frontend
COPY ./webpage /app/
RUN npm run build

# Remove unnecessary files
RUN rm -rf node_modules
RUN npm prune --production

# Use a smaller base image and copy compiled artifacts
FROM node:alpine
COPY --from=build /app /app

# Set working directory and expose ports
WORKDIR /app
EXPOSE 3000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
