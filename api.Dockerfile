# Set node alpine as the base image for the builder
FROM node:16.17.0-alpine as builder

# Set the working directory where the app will be installed
WORKDIR /usr/src/app

# Don't fully understand what this does
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# This is need to prevent the app from failing on build (reason unknown)
ENV NX_DAEMON=false

# Copy the main package.json and package-lock.json 
COPY package.json package.json
COPY package-lock.json package-lock.json

# Python is a requirement of nodemail and bcrypt so we need to install this
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Install all the dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Build the app, this will compile the source code 
RUN npm run build api -- --configuration=production --verbose

# Set the base image for the final image
FROM node:16.17.0-alpine

# Set the working directory where the app will be installed
WORKDIR /usr/src/app

# ??
RUN mkdir -p src/app/core/database

# Copy the compiled files from the builder
COPY --from=builder /usr/src/app/dist/apps/api .

# Copy the files that are needed for the database migration and add them to the root of the app
COPY --from=builder /usr/src/app/apps/api/migrate.ts .
COPY --from=builder /usr/src/app/apps/api/tsconfig.migrations.json .
COPY --from=builder /usr/src/app/apps/api/migrations ./migrations
COPY --from=builder /usr/src/app/apps/api/src/app/core/database ./src/app/core/database

# Copy the entrypoint script to the root of the app
COPY --from=builder /usr/src/app/apps/api/docker-entrypoint.sh .

# Set the environment variables
ENV PORT=3333
EXPOSE ${PORT}

# Seems to be required INTERMITTENTLY ??? wtf
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Run npm install 
RUN npm install --production --legacy-peer-deps

# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express@^9.0.0 umzug@2.3.0 tsconfig-paths --legacy-peer-deps
RUN npm install -g ts-node --legacy-peer-deps
RUN npm install -g typescript --legacy-peer-deps

# Install dependacies to run the migrations, these may have been missed in the build
RUN npm i --save-dev @types/node --legacy-peer-deps

RUN chmod +x ./docker-entrypoint.sh

USER node

RUN ls

ENTRYPOINT ["./docker-entrypoint.sh"]
