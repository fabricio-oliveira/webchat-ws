# Builder
FROM node:19-alpine


# install dependecies from projects
RUN mkdir app
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

ENV NPM_CONFIG_UNSAFE_PERM=true

RUN yarn install

EXPOSE 3001 3001

CMD ["yarn", "dev"]
