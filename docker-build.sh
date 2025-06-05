#!/bin/bash
NAME=sk
IMAGE_NAME="nav-fe"
VERSION="1.0.0"

# Docker 이미지 빌드
sudo docker build \
  --tag ${NAME}-${IMAGE_NAME}:${VERSION} \
  --file Dockerfile \
  --platform linux/amd64 \
  ${IS_CACHE} .
