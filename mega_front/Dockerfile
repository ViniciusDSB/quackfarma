FROM node:20-alpine

WORKDIR /megaprojeto/front

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
CMD ["npm", "run", "serve"]