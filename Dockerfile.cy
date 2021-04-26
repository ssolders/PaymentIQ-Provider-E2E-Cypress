# 1) docker build --no-cache -f Dockerfile.cy -t piq/provider-e2e-tests .
# 2) docker run --ipc=host --shm-size=2500M --name provider-e2e-tests-1 --rm -i piq/provider-e2e-tests npm run cypress:all

FROM cypress/browsers:node14.15.0-chrome86-ff82
WORKDIR /bambora
COPY package.json .
RUN npm install
COPY . .
