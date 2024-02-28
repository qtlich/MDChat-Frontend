#FROM node:20.11.1 AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
#COPY . .
#RUN NODE_OPTIONS=--openssl-legacy-provider npm run build #|| cat /tmp/ng-*/angular-errors.log

FROM nginx:stable
COPY ./dist/ /usr/share/nginx/html
EXPOSE 80
c
