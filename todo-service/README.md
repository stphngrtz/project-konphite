# TODO Service
A simple CRUD service for todo list items.

```bash
# prerequisite: Redis
docker run --name redis -d -p 6379:6379 redis:7

# build and run executable jar
../gradlew :todo-service:build
java -jar build/libs/todo-service-0.0.1-SNAPSHOT.jar

# spring boot run task
../gradlew :todo-service:bootRun

# create Docker image
docker build -f src/main/docker/Dockerfile -t konphite/todo-service .

# run Docker container
docker run --name todo-service -d -p 8080:8080 -e SPRING_DATA_REDIS_HOST=$HOST konphite/todo-service

# run Docker container from ghcr.io
docker run --name todo-service -d -p 8080:8080 -e SPRING_DATA_REDIS_HOST=$HOST ghcr.io/stphngrtz/konphite/todo-service:latest

# run in Kubernetes from Helm chart (with Redis as dependency)
helm install todo-service src/main/helm
```

See `requests.http` for example requests.


## Ingredients
List of things I've (more or less) used for the first time during project implenmentation.

- [Gradle](https://gradle.org/) (Kotlin)

  Up until now I was still using Maven. It has always worked like a charm, was fast enough, extensible enough (if you know how to write plugins) and I know my way around. But I always wanted to know more about the competitor, the other thing called *Gradle* that some praise like a new religion. Now this time has finally come and I have to admit, it has its value. I may not even going back...

- [Spring Boot 3](https://spring.io/projects/spring-boot)

  I've spent a good part of my professional career with Spring Boot and even if version 3 is quite new, I have to admit that this service doesn't (yet) make use of any version 3 features. But anyway, you have to start somewhere, right?

- [Kotlin](https://kotlinlang.org/)

  I am reluctant when it comes to new JVM languages. You remember the Scala hype from a few years ago? Where is it now? Gone, basically. Don't get me wrong, we need those language to inspire Java or other languages, but up until know I didn't feel the need to use anything except Java for my projects. With Kotlin this is a bit different. I can't even express why, maybe it's because of the interoperability, the simple syntax or just the style - I don't know. But what I know is that I enjoy writing Kotlin code and that I'm looking forward to use it in some more advanced projects.

- [Redis](https://redis.io/)

  Redis is on my list of things that I want to get to know for a very long time. Unfortunately I still cannot mark it as done, because as for now, I'm only using it through Spring Data, which abstracts everything. Maybe I can extend the usage in the near future.

- [Testcontainers](https://www.testcontainers.org/)

  I've used Testcontainers in the past, but not with Redis and not from a test written in Kotlin.

## Troubleshooting
### Testcontainers with Colima
The integration test makes use of [Testcontainers](https://www.testcontainers.org/) to launch up a Redis instance. If you are on macOS and use [Colima](https://github.com/abiosoft/colima) as Docker runtime, this probably won't work out-of-the-box. You might get one of the following exceptions: 

```
java.lang.IllegalStateException: Could not find a valid Docker environment. Please see logs and check configuration
```

```
com.github.dockerjava.api.exception.NotFoundException: Status 404: {"message":"No such container: ded138..."}
```

To fix this, you need to set the following environment variables:

```bash
export DOCKER_HOST="unix://${HOME}/.colima/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
```

See [testcontainers issue #5034](https://github.com/testcontainers/testcontainers-java/issues/5034) for more details.
