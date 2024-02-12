FROM node:18 as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .
ARG API_KEY
RUN mv src/app/app.component.ts src/app/app.component.ts.bak
RUN apt-get update && apt-get install gettext -y
RUN envsubst '$API_KEY' < src/app/app.component.ts.bak > src/app/app.component.ts
RUN rm src/app/app.component.ts.bak
RUN npm run build

FROM nginx as runtime
COPY --from=build /app/dist/poem-generator /usr/share/nginx/html
