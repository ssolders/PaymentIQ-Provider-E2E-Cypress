FROM cypress/browsers:node14.15.0-chrome86-ff82
WORKDIR /bambora
COPY package.json .
RUN npm install
COPY . .
