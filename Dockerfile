FROM node:14

LABEL maintainer="Anton Lebedev <mailbox@lebster.me>"

WORKDIR /test

RUN sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
RUN ls -l /root/.local/bin
#RUN export PATH=$PATH:/root/.local/bin
ENV PATH="/root/.local/bin:${PATH}"
RUN flow version
COPY ./test/package.json ./test/package-lock.json ./
RUN npm ci
