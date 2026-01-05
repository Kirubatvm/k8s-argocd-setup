FROM node:18-alpine
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN npm install --production

COPY --chown=node:node . .

USER node
EXPOSE 5000

CMD ["npm", "start"]
