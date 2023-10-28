FROM node:19 AS builder
COPY . /app
WORKDIR /app
RUN yarn install && yarn build

FROM nginx:1.20-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
