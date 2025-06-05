# 1단계: Node 이미지에서 React 앱 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# package.json, package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 2단계: Nginx에 빌드된 정적 파일 복사
FROM nginx:stable-alpine

# Nginx 기본 설정을 커스텀 설정으로 덮어쓰기 (필요 시)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# React 빌드 결과물을 Nginx 기본 웹 루트에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx 80 포트 오픈
EXPOSE 80

# Nginx 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
