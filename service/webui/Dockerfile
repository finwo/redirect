FROM node:lts as builder

COPY . /app
WORKDIR /app
RUN npm install
RUN node esbuild.js

FROM node:lts as runner
WORKDIR /app
COPY package.json      /app/package.json
COPY package-lock.json /app/package-lock.json
COPY util/server.js    /app/util/server.js
RUN npm install --production
COPY --from=builder /app/dist /app/dist

ENV DOCROOT /app/dist

CMD node util/server.js
