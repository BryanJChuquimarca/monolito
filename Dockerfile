
FROM node:22-alpine

RUN apk update && apk add postgresql postgresql-contrib bash su-exec

RUN mkdir -p /run/postgresql /var/lib/postgresql/data && \
    chown -R postgres:postgres /run/postgresql /var/lib/postgresql

USER postgres
RUN initdb -D /var/lib/postgresql/data && \
    pg_ctl -D /var/lib/postgresql/data start && \
    psql --command "CREATE USER usuario WITH Password 'password';" && \
    psql --command "CREATE DATABASE monolito OWNER usuario;" && \
    pg_ctl -D /var/lib/postgresql/data stop

USER root

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD su-exec postgres pg_ctl -D /var/lib/postgresql/data start && node init-db.js && node index.js