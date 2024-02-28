#FROM node:20.11.1 AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
#COPY . .
#RUN NODE_OPTIONS=--openssl-legacy-provider npm run build #|| cat /tmp/ng-*/angular-errors.log

FROM nginx:stable

ARG DIST=D:/Projects/mdchat-front/dist
ARG NGINX_CONF=D:/Projects/mdchat-front/nginx.conf

COPY $NGINX_CONF /etc/nginx
COPY $DIST/browser/* /usr/share/nginx/html
EXPOSE 80
