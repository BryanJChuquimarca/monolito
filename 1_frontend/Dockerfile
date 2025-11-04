FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 42000

RUN npm run build --prod

RUN npm install -g http-server

CMD http-server dist/1_frontend/browser -p 4200 --cors