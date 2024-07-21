# Server Dockerfile

FROM node:20.13.1

RUN mkdir -p /opt/app/src/server_fatsecret

WORKDIR /opt/app/src/server_fatsecret

# Install dependencies from node_modules
COPY . /opt/app/src/server_fatsecret/
RUN npm install

CMD ["node", "server.js"]