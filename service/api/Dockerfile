FROM node:lts

COPY . /app
WORKDIR /app
RUN \
  npm install ; \
  npm run build ; \
  rm -rf node_modules ; \
  npm install --production

CMD npm start
