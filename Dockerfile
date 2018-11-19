# base image
FROM node:9.6.1

# # install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/gameplayapp
WORKDIR /usr/src/gameplayapp

# add `/usr/src/gameplayapp/node_modules/.bin` to $PATH
ENV PATH /usr/src/gameplayapp/node_modules/.bin:$PATH

# install and cache gameplayapp dependencies
COPY package.json /usr/src/gameplayapp/package.json
RUN npm install
RUN npm install -g @angular/cli@1.7.1
RUN npm install @aspnet/signalr

# add gameplayapp
COPY . /usr/src/gameplayapp

# start gameplayapp
CMD ng serve --host 0.0.0.0
