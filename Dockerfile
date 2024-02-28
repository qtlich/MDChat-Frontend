# Use official node image as the base image
FROM node:latest as build
#
## Set the working directory
WORKDIR D:/man2023/mdchat/front/mdchat/src/app
#
## Add the source code to app
COPY ./ /usr/local/app/
#
## Install all the dependencies
RUN npm install
#
## Generate the build of the application
RUN npm run build
#
#
## Stage 2: Serve app with nginx server
#
## Use official nginx image as the base image
FROM nginx:latest
#
## Copy the build output to replace the default nginx contents.
COPY --from=build D:/man2023/mdchat/front/mdchar/src/app/dist/browser /usr/share/nginx/html
#
## Expose port 80
EXPOSE 80
#STAGE 1
#FROM node:lts-alpine AS build
#WORKDIR D:/man2023/mdchat/front/mdchat/src/app
#COPY package.json package-lock.json ./
#RUN npm cache clean --force
#RUN npm install
#COPY . .
#RUN npm install -g @angular/cli
#RUN npm run build
#
##STAGE 2
#FROM nginx:1.25.3-alpine
#COPY nginx.conf /etc/nginx/nginx.conf
#COPY --from=build /usr/src/app/dist/sample-app /usr/share/nginx/html
