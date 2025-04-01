FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit dev

COPY . .
RUN npx prisma generate
EXPOSE 4002

CMD [ "npm", "start" ]