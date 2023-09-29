FROM node:18-alpine as build

ARG VITE_API_BASE_URL

RUN test -n "$VITE_API_BASE_URL" || (echo "VITE_API_BASE_URL not set" && false)

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