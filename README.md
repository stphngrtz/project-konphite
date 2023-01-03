# Project Konphite
In the scope of this project I want to get some hands-on experience with stuff I'm not familiar with. Typically, you should not add too many unknown technologies to a new project, if you want to have a chance to complete it. This right here is quite the opposite. But hey, I don't have to complete it. The journey is the reward.

To be honest, not everything will be completely new to me, but at least to some degree. Spring Boot, for example. I've spend a good amount of time with Spring Boot 2, but in this project I'm going to add a Spring Boot 3 service. They haven't reinvented the wheel with version 3, of course, but still, some things have changed. You get the idea.

Important note: don't take my architectural decisions serious! This project is not about when to use what technology. I'll come up with silly use-cases, because I want to spend my precious time learning about technology, not giving best-practice advice or implementing a unique business idea.

Oh, speaking of serious decisions, the project name comes from a [name generator](https://mrsharpoblunto.github.io/foswig.js/), it has no special meaning.

## Table of Contents
This section is intended to give an overview of what is inside this project, with a short list of used technologies / tools. For more details please see the README of the sub-project.

### Documentation
In `/documentation` [(link)](./documentation/) you can find a dummy lorem ipsum documentation, written in AsciiDoc, using some PlantUML diagrams and a deployment pipeline to GitHub Pages.

- [AsciiDoc](https://asciidoctor.org/)
- [PlantUML](https://plantuml.com/)
- [GitHub Pages](https://pages.github.com/)

### TODO-Service
In `/todo-service` [(link)](./todo-service/) I've put a simple CRUD service for todo list items, written in Kotlin, based on Spring Boot 3.

- [Gradle](https://gradle.org/) (Kotlin)
- [Spring Boot 3](https://spring.io/projects/spring-boot)
- [Kotlin](https://kotlinlang.org/)
- [Redis](https://redis.io/)
- [Testcontainers](https://www.testcontainers.org/)

### Bookmark-Service
`/bookmark-service` [(link)](./bookmark-service/) contains a simple CRUD service for bookmarks, written in TypeScript, based on NestJS.

- [Node.js](https://nodejs.org/) / npm
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Passport](https://www.passportjs.org/) (JWT Strategy)
- [Jest](https://jestjs.io/) e2e tests
- [PactumJS](https://pactumjs.github.io/)
