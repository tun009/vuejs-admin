FROM hub.vtcc.vn:8989/library/node:18-alpine
ENV http_proxy=http://10.30.153.169:3128; https_proxy=http://10.30.153.169:3128

COPY . /app
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm install

ENV http_proxy=
ENV https_proxy=
EXPOSE 8080

CMD ["pnpm", "run", "preview:prod"]
