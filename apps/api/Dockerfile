FROM node:20-alpine

WORKDIR /app
COPY package.json /app/package.json
COPY apps/api/package.json /app/apps/api/package.json
RUN npm install

COPY apps/api /app/apps/api
WORKDIR /app/apps/api

EXPOSE 6661
CMD ["npm", "run", "dev"]
