# 1단계: Node 이미지에서 React 앱 빌드
FROM node:20-alpine AS builder

# 여기에 환경변수 추가 (빌드 타임용)
ENV REACT_APP_API_URL=https://sk-nav7.skala25a.project.skala-ai.com/api/v1/ 
ENV REACT_APP_ENCRYPTION_KEY=Sknav7_!Key__AES_92

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: Nginx에서 정적 파일 제공
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
