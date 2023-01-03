# Bookmark Service
A simple CRUD service for bookmarks.

Big shoutout to [Vlad](https://github.com/vladwulf) and his great FreeCodeCamp tutorial.
- Tutorial: https://www.youtube.com/watch?v=GHTA143_b-s
- Souces: https://github.com/vladwulf/nestjs-api-tutorial

```bash
# prerequisite: postgres
docker run --name postgres -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=super_secret_pw -e POSTGRES_DB=bookmarks postgres:15

# ... or via npm script, which also does the migration
npm run db:dev:start

# install required dependencies
npm install

# run in dev mode (watching for changes)
npm run start:dev

# build prod files
npm run build

# run in prod mode, which also does the migration
npm run start:migrate:prod

# create Docker image
docker build -t konphite/bookmark-service:latest .

# run Docker container
export IP=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -p 3000:3000 -e DATABASE_URL="postgresql://postgres:super_secret_pw@$IP:5432/bookmarks?schema=public" -e JWT_SECRET=super_secret konphite/bookmark-service:latest

# run Docker container from ghcr.io
export IP=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -p 3000:3000 -e DATABASE_URL="postgresql://postgres:super_secret_pw@$IP:5432/bookmarks?schema=public" -e JWT_SECRET=super_secret ghcr.io/stphngrtz/konphite/bookmark-service:latest
```

## Ingredients
List of things I've (more or less) used for the first time during project implenmentation.

- [Node.js](https://nodejs.org/) / npm

  Do you know the ["... and at this point I'm too afraid to ask" meme](https://knowyourmeme.com/memes/afraid-to-ask-andy)? Well, this is basically the story with me and Node. Haven't really used it in the past but was always eager to get my hands dirty. Now I'm happy to have at least a little something implemented with Node. Was about time!

- [NestJS](https://nestjs.com/)

  A Spring-like framework, but for Node. Adds an out-of-the-box application architecture to robust HTTP server frameworks like Express. My first experience was amazing and I can definitely recommend it.

- [Prisma](https://www.prisma.io/)

  Prisma calls itself a next-generation ORM. Well, I'd say that's more of an understatement. It comes with a DSL to describe the model, a code generator, a type-safe database client, automated migrations and even a database browser. I know nothing about possible alternatives in the Node space, but Prisma looks like a good choice.

- [Passport](https://www.passportjs.org/) (JWT Strategy)

  Passport is an authentication middleware for Express based applications. I havn't even scratched the surface of what it can do but it looks solid and the JWT strategy was as easy to use as one can imagine.

- [Jest](https://jestjs.io/) e2e tests

  To my understanding, Jest is the go to standard when it comes to tests in a Node environment. Because of my not existing experience in this regards I can only compare it to Java testing frameworks. I had no difficulties picking it up, writing my tests and interpreting the output. I love its simplicity and I'm looking forward to use it again.

- [PactumJS](https://pactumjs.github.io/)

  I'm used to [REST-assured](https://rest-assured.io/) and PactumJS seems to be the perfect alternative in a Node environment. Give it a try, if you haven't yet.

## Commands
Some commands I've used to create this project.

```bash
# create project
nest new --package-manager npm --skip-git bookmark-service

# generate new module
nest g module auth

# generate service within module
nest g service auth --no-spec

# generate controller within module
nest g controller auth --no-spec

# install dev dependency
npm install --save-dev prisma

# install dependency
npm install --save @prisma/client

# bootstrap prisma
npx prisma init

# generate assets from schema.prisma
npx prisma generate

# create migration and apply to database
npx prisma migrate dev

# apply all available migrations to database
npx prisma migrate deploy

# visual database editor at port 5555
npx prisma studio

# visual database editor at port 5555 for test environment
npx dotenv -e .env.test -- prisma studio

# start app and watch for changes
npm run start:dev
```
