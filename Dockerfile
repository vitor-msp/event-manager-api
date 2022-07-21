FROM node:latest as builder
RUN mkdir /api
WORKDIR /api
COPY package.json .
COPY tsconfig.json .
COPY .env .
COPY src ./src
RUN npm install
RUN npm run build

FROM node:latest
RUN mkdir /api
WORKDIR /api
COPY package.json .
COPY --from=builder /api/dist ./dist
RUN npm install --only=production
EXPOSE 8080
CMD ["npm", "run", "start"]