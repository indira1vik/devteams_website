# ---------- BUILD BACKEND PRODUCTION ----------

# BASE IMAGE
FROM node:22 AS builder

# APP DIRECTORY
WORKDIR /app

# COPY AND INSTALL DEPENDENCIES
COPY package.json package-lock.json* ./
RUN npm install

# COPY AND GENERATE PRISMA
COPY prisma ./prisma
RUN npx prisma generate

# COPY SOURCE FILES
COPY tsconfig.json ./
COPY src ./src

# BUILD TYPESCRIPT
RUN npm run build

# ---------- RUN BACKEND PRODUCTION ----------

# BASE IMAGE
FROM node:22

# APP DIRECTORY
WORKDIR /app

# COPY AND INSTALL PRODUCTION DEPENDECIES
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# COPY OUTPUT
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# PORT
EXPOSE 4000

# START SERVER
CMD [ "node", "dist/index.js" ]