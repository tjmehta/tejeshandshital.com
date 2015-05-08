FROM node:0.10.38

# Install ruby-sass
RUN apt-get update \
    && apt-get install -y --no-install-recommends ruby-sass \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean -y \
    && apt-get autoremove -y

# Set encoding for SASS
ENV LC_ALL en_US.UTF-8

# APP
WORKDIR /tejeshandshital.com
ADD ./package.json /tejeshandshital.com/package.json
RUN npm install
ADD . /tejeshandshital.com
RUN echo hey > ./client/scripts/bundle.js
RUN npm run build
ENV PORT 3000
EXPOSE 3000
CMD npm start