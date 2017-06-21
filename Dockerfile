FROM node:8.1.2
EXPOSE 9006

RUN apt update
RUN apt install -y libgd2-dev
RUN apt install -y graphicsmagick
RUN apt install -y libstdc++6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN rm -rf /usr/src/app/node_modules
RUN npm install && npm cache clean --force

COPY . /usr/src/app

CMD ["npm", "start"]


