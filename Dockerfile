# docker build -t nmui-site .
# docker run --rm -p 8080:80 nmui-site

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
# nginx workers run as the `nginx` user, not root — make everything readable
# regardless of the permission bits on the build machine.
RUN chmod -R a+rX /usr/share/nginx/html
