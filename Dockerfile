FROM nginx:stable

COPY nginx.conf /etc/nginx
COPY dist/browser/* /usr/share/nginx/html
EXPOSE 80
