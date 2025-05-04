FROM node:18

WORKDIR /app

COPY package*.json .
RUN npm install --omit=dev

COPY . .
RUN npx prisma generate --schema=./src/prisma/schema.prisma
EXPOSE 4002

CMD [ "npm", "start" ]