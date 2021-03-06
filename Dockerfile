FROM node:12

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY main.js ./

VOLUME /storage
ENV VOLUME=/storage
ENV LISTEN_PORT=4000

CMD yarn start
