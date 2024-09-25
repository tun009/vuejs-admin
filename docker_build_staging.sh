export IMAGE_VER=0.0.1-stg
export IMAGE_TAG=eximbank-ui
docker build -t $IMAGE_TAG:$IMAGE_VER .
# docker tag $IMAGE_TAG:$IMAGE_VER hub.vtcc.vn:8999/vtcc/ocr/$IMAGE_TAG:$IMAGE_VER
# docker push hub.vtcc.vn:8999/vtcc/ocr/$IMAGE_TAG:$IMAGE_VER
