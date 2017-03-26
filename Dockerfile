FROM node:6
MAINTAINER Daniel Jones <tortxof@gmail.com>

RUN groupadd -r docker && useradd -r -g docker docker

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb && \
    dpkg -i dumb-init_1.2.0_amd64.deb && \
    rm dumb-init_1.2.0_amd64.deb

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/
RUN npm run postinstall

USER docker
EXPOSE 5000

ENTRYPOINT ["dumb-init"]
CMD [ "npm", "start" ]
