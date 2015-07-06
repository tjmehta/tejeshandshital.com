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
WORKDIR /api.tejeshandshital.com
ADD ./package.json /api.tejeshandshital.com/package.json
RUN npm install
ADD . /api.tejeshandshital.com
ENV PORT 3000
EXPOSE 3000
CMD npm start