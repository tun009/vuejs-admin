export IMAGE_VER=v0.0.18
export IMAGE_TAG=eximbank-ui
docker build -t $IMAGE_TAG:$IMAGE_VER .
docker tag $IMAGE_TAG:$IMAGE_VER hub.vtcc.vn:8999/vtcc/ocr/$IMAGE_TAG:$IMAGE_VER
docker push hub.vtcc.vn:8999/vtcc/ocr/$IMAGE_TAG:$IMAGE_VER
