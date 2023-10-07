FROM node:16-slim

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /user/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get -qy update && apt-get -qy install openssl

RUN npm install
RUN npm install @prisma/client

COPY . .
RUN npx prisma generate --schema ./prisma/schema.prisma

RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]
