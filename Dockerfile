FROM nginx:1.15.2-alpine
COPY ./build /var/www
COPY ./docker/auth/htpasswd /etc/nginx/auth/htpasswd
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
