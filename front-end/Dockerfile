# ═══════ STAGE 1: BUILD ═══════
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Inject URL backend lúc build (React build = static, hardcode URL vào JS)
ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
RUN npm run build
# Kết quả: /app/build/ chứa index.html + static JS/CSS

# ═══════ STAGE 2: SERVE ═══════
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# nginx tự start sẵn → không cần CMD