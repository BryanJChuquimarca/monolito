FROM node:22-alpine

COPY . .

EXPOSE 3000

RUN rm -rf node_modules && npm install

CMD ["npm", "start"]