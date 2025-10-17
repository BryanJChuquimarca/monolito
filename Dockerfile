FROM node:22-alpine


#instalar postgres
RUN apk update && apk add --no-cache postgresql postgresql-client postgresql-contrib su-exec bash
#crear carpeta para la DB
RUN mkdir -p /run/postgresql /var/lib/postgresql/data
RUN chown -R postgres:postgres /run/postgresql /var/lib/postgresql/data 

USER postgres
RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql/data && chmod 700 /var/lib/postgresql/data

RUN initdb -D /var/lib/postgresql/data && \
    pg_ctl start -D /var/lib/postgresql/data && \
    psql --command "CREATE USER usuario WITH PASSWORD '123456';" && \
    psql --command "CREATE DATABASE db_monolito OWNER usuario;" &&\
    pg_ctl stop -D /var/lib/postgresql/data

USER root
WORKDIR /app
COPY . .

RUN npm install
EXPOSE 3000

#inicia postgres && node init-db.js && node index.js
CMD su-exec postgres pg_ctl -D /var/lib/postgresql/data start && node init-db.js && node index.js