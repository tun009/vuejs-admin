export IMAGE_VER=v0.0.3
export IMAGE_TAG=eximbank-ui
docker build -t $IMAGE_TAG:$IMAGE_VER .
docker tag $IMAGE_TAG:$IMAGE_VER registry.cyberspace.vn/ocr/$IMAGE_TAG:$IMAGE_VER
docker push registry.cyberspace.vn/ocr/$IMAGE_TAG:$IMAGE_VER
