FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm run build

FROM nginx

COPY build /usr/share/nginx/html

EXPOSE 80
