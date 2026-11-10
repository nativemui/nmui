# Dockerfile — nginx serving the app with SPA fallback.
# Uses the nginx.conf from ../nginx/ (copy it next to this file,
# or use the nmui repo root, which ships both).
#   docker build -t myapp .
#   docker run --rm -p 8080:80 myapp
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
