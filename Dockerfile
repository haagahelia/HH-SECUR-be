FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

# npm start runs "prestart" (npm run migrate) first: if a migration fails the container exits
# instead of running on the wrong schema. Any platform that starts the app with npm start migrates too.
CMD ["npm", "start"]