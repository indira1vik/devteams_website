# ---------- BUILD BACKEND PRODUCTION ----------

# BASE IMAGE
FROM node:22 AS builder

# APP DIRECTORY
WORKDIR /app

# COPY AND INSTALL DEPENDENCIES
COPY package.json package-lock.json* ./
RUN npm install

# COPY SOURCE FILES
COPY . .

# BUILD TYPESCRIPT
RUN npm run build

# ---------- RUN BACKEND PRODUCTION ----------

# BASE IMAGE
FROM node:22

# APP DIRECTORY
WORKDIR /app

# INSTALL STATIC SERVER
RUN npm install -g serve

# COPY OUTPUT
COPY --from=builder /app/dist ./dist

# PORT
EXPOSE 5173

# START CLIENT
CMD ["serve", "-s", "dist", "-l", "5173"]