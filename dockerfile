FROM node:18-alpine
WORKDIR  /fe-sipd-hub/
COPY /fe-sipd-hub/public/ /fe-sipd-hub/public 
COPY /fe-sipd-hub/src/ /fe-sipd-hub/src 
COPY /fe-sipd-hub/package.json /fe-sipd-hub/
RUN yarn install
