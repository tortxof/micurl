FROM node:4
MAINTAINER Daniel Jones <tortxof@gmail.com>

RUN groupadd -r docker && useradd -r -g docker docker

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.1.3/dumb-init_1.1.3_amd64.deb && \
    dpkg -i dumb-init_1.1.3_amd64.deb && \
    rm dumb-init_1.1.3_amd64.deb

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY . /usr/src/app/
RUN npm install

USER docker
EXPOSE 5000

ENTRYPOINT ["dumb-init"]
CMD [ "npm", "start" ]
