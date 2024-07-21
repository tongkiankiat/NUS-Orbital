# Client Side Docker
FROM node:20.13.1

WORKDIR /app

# This port is for FatSecretAPI
EXPOSE 3000

# This port is for Diet Plan Generation using model from: https://github.com/zakaria-narjis/Diet-Recommendation-System
EXPOSE 5000

# install dependencies
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/

CMD ["npx", "expo", "start", "-c"]

