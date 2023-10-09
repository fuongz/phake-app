FROM node:lts

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /user/src/app

COPY . .
RUN rm -rf pnpm-lock.yaml

RUN npm install
RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]
