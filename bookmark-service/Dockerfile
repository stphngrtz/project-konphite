###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:19-bullseye AS development
# cannot use alpine or slim image b/c of a bug with Prisma, see
# - https://github.com/prisma/prisma/issues/8478
# - https://github.com/prisma/prisma/issues/9572
# - https://github.com/prisma/prisma/issues/16553

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:19-bullseye AS build
# cannot use alpine or slim image b/c of a bug with Prisma, see
# - https://github.com/prisma/prisma/issues/8478
# - https://github.com/prisma/prisma/issues/9572
# - https://github.com/prisma/prisma/issues/16553

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:19-bullseye AS production
# cannot use alpine or slim image b/c of a bug with Prisma, see
# - https://github.com/prisma/prisma/issues/8478
# - https://github.com/prisma/prisma/issues/9572
# - https://github.com/prisma/prisma/issues/16553

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

ENV DATABASE_URL=""
ENV JWT_SECRET=""

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start:migrate:prod" ]

# thanks to https://www.tomray.dev/nestjs-docker-production