FROM node:4
MAINTAINER Daniel Jones <tortxof@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/
RUN npm run postinstall

USER app
EXPOSE 5000

CMD [ "npm", "start" ]
