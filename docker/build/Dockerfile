FROM debian:latest

ARG github_username
ARG github_token

RUN apt update && apt install python git curl software-properties-common build-essential -y 
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
RUN apt update && apt install nodejs -y

RUN npm install -g truffle && \
    npm install -g @angular/cli && \
    npm install -g ganache

WORKDIR /root

RUN echo "Cloning code"
RUN git clone https://${github_username}:${github_token}@github.com/TU-Blockchain-Lab/role-based-dao.git App \
    && cd App \
    && npm i

WORKDIR /root
COPY entrypoint.sh /root/entrypoint.sh
ENTRYPOINT ["bash", "./entrypoint.sh"]
