FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4201

RUN npm run build --prod

RUN npm install -g http-server

CMD http-server dist/1_frontend/browser -p 4201 -P http://localhost:4201 --cors