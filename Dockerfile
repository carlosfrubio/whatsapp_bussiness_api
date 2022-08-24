FROM node:12.18-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./serviceAccountKey.json", "./"]
RUN npm install --production --silent

WORKDIR /usr/src/app/dist
COPY ./dist .

ENV DB="mongodb://admin:admin@mongo:27017/admin?retryWrites=true&w=majority"

EXPOSE 8005
CMD ["npm", "start"]
