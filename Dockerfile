FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

# Migrate first: if a migration fails the container exits instead of running on the wrong schema
CMD ["sh", "-c", "npm run migrate && npm start"]