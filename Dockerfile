FROM artburkart/elixir:1.0.5
MAINTAINER Arthur Burkart <arturkart@gmail.com>

# Set up environment variables
ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

ENV PHOENIX_VERSION 1.0.2
ENV NODE_VERSION 4.1.1
ENV NPM_VERSION 2.14.0

# Install inotify-tools for watching files
RUN apt-get update \
  && apt-get install -y inotify-tools \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js and NPM in order to satisfy brunch.io dependencies
# the snippet below is borrowed from the official nodejs Dockerfile
# https://registry.hub.docker.com/_/node/
ADD http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz /
RUN tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
 && rm "node-v$NODE_VERSION-linux-x64.tar.gz" \
 && npm install -g npm@"$NPM_VERSION" \
 && npm cache clear

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install

EXPOSE 4000

CMD ["bash", "-c", "mix deps.get <<< $'y\n' && mix phoenix.server"]
