FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm run build

FROM nginx

COPY build /usr/share/nginx/html

COPY config/pdms.conf /etc/nginx/conf.d/pdms.conf
RUN rm -rf /etc/nginx/conf.d/default.conf

EXPOSE 80
