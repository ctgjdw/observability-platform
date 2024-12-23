FROM node:20.12
WORKDIR /opt/app

COPY package*.json ./
COPY *npmrc ./

RUN npm install --prefer-offline --progress=false --loglevel warn 

RUN npm list

COPY . . 

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]

