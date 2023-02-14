FROM node:18 as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install

COPY . .
ARG API_KEY
RUN mv src/app/app.component.ts src/app/app.component.ts.bak && \
    apt-get update && apt-get install gettext -y && \
    envsubst '$API_KEY' < src/app/app.component.ts.bak > src/app/app.component.ts && \
    rm src/app/app.component.ts.bak && \
    ng build

FROM nginx as runtime
COPY --from=build /app/dist/poem-generator /usr/share/nginx/html
