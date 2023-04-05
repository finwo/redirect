FROM node:lts as builder

COPY . /app
WORKDIR /app
RUN npm i
RUN node esbuild.js

FROM node:lts as runner
COPY --from=builder /app/dist /srv
RUN npm install --global serve
CMD serve -s /srv
