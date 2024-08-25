FROM node:14-alpine
COPY . /src/app
WORKDIR /src/app
RUN npm install --non-interactive --frozen-lockfile
