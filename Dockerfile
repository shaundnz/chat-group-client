FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM build AS run

WORKDIR /app

COPY --from=build /app .

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]